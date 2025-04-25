import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreatePetitionDto } from "./petition.dto";
import { UpdatePetitionDto } from "./petition.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Petition } from "./petition.entity";
import { Match } from "match/match.entity";
import { User } from "user/user.entity";
import { HydratedDocument, Model, Types } from "mongoose";
import { PetitionModelType, PetitionStatus } from "./petition.enum";
import { FindManyFilter } from "filter/filter.dto";
import { PushNotificationService } from "services/pushNotificationservice";
import { Group } from "groups/group.entity";
import { Filter, FilterResponse } from "types/types";
import { ActivityService } from "activity/activity.service";
import { UserService } from "user/user.service";
type ModelHandlers = {
  [key in PetitionModelType]: {
    model: Model<any>;
    validate: (target: any, emitterId: Types.ObjectId) => Promise<void>;
  };
};
const translate: Record<PetitionModelType, string> = {
  Group: "grupo",
  Match: "partido",
};
const plural: Record<PetitionModelType, string> = {
  Group: "groups",
  Match: "matches",
};

@Injectable()
export class PetitionService {
  constructor(
    @InjectModel(Petition.name) private readonly petitionModel: Model<Petition>,
    @InjectModel(Match.name) private readonly matchModel: Model<Match>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
    private readonly notificationService: PushNotificationService,
    private readonly userService: UserService,
    private readonly activityService: ActivityService
  ) { }

  modelHandlers: ModelHandlers = {
    [PetitionModelType.match]: {
      model: this.matchModel,
      validate: async (target, emitterId) => {
        if (!target) {
          throw new NotFoundException("PARTIDO no encontrado");
        }
      },
    },
    [PetitionModelType.group]: {
      model: this.groupModel,
      validate: async (target) => {
        if (!target) {
          throw new NotFoundException("GRUPO no encontrado");
        }
      },
    },
  };

  /**
   * Crea una nueva petición (o invitación) asociada a un partido o a un grupo.
   *
   * ### Regla de negocio básica
   * - **Petición**: el *emitter* NO es administrador del recurso ⇒ solicita unirse.
   * - **Invitación**: el *emitter* SÍ es administrador ⇒ invita a otro usuario.
   *
   * Para cada (usuario, recurso) solo puede existir:
   * 1. Una petición *emitida*     (user ➜ recurso)
   * 2. Una invitación *recibida*  (recurso ➜ user)
   * Una vez aceptada/rechazada no se puede volver a enviar otra.
   *
   * @param createPetitionDto – `{ emitter, receiver, reference: { id, type } }`
   * @returns La petición recién persistida.
   *
   * @throws NotFoundException    Si el emisor, receptor o recurso no existen.
   * @throws BadRequestException  – Petición/Invitación duplicada
   *                              – Petición/invitación antes rechazada
   *                              – Cupo del recurso completo
   *                              – Tipo de referencia no soportado
   *                              - Emisor y receptor son el mimso usuario
   */
  async create(createPetitionDto: CreatePetitionDto): Promise<Petition> {
    const { emitter, receiver, reference } = createPetitionDto;
    const targetId = reference.id
    const modelType = reference.type

    // ───────────────────────────────────────── Validaciones básicas ──
    // TODO: mover a pipes/guards genéricos ('shouldExistGuard')
    const emitterExist = await this.userModel.findById(emitter).exec();
    const receiverExist = await this.userModel.findById(receiver).exec();

    if (!emitterExist) {
      throw new NotFoundException("EMISOR de la peticion no encontrado");
    }

    if (!receiverExist) {
      throw new NotFoundException("RECEPTOR de la peticion no encontrado");
    }

    if ((receiver).equals(emitter)) {
      throw new BadRequestException("El emisor y receptor no pueden ser el mismo usuario");
    }

    // Obtener el modelo y la función de validación correspondiente
    const handler = this.modelHandlers[modelType];
    if (!handler) {
      throw new BadRequestException("Tipo de referencia no soportado");
    }
    const target = await handler.model.findById(targetId).exec();

    // Validar el modelo objetivo (group o match)
    await handler.validate(target, emitterExist._id as Types.ObjectId);

    // Verificar si el emisor es el creador del partido
    const isEmitterCreator = new Types.ObjectId(target.userId).equals(
      emitterExist.id,
    );

    // Verificar si ya existe una petición con el mismo emitter y match
    const existingPetitionEmitter = await this.petitionModel
      .findOne({
        emitter: new Types.ObjectId(emitter),
        reference: {
          id: new Types.ObjectId(targetId),
          type: modelType
        }
      })
      .exec();

    if (
      existingPetitionEmitter &&
      existingPetitionEmitter.status == PetitionStatus.Declined
    ) {
      throw new BadRequestException("Petición previamente rechazada");
    } else if (existingPetitionEmitter && !isEmitterCreator) {
      // Si no es el creador y ya existe una solicitud, se lanza la excepción
      throw new BadRequestException(
        `Ya existe una petición de este usuario para este ${translate[modelType]}`,
      );
    }
    const existingPetitionReceiver = await this.petitionModel
      .findOne({
        receiver: new Types.ObjectId(receiver),
        reference: {
          id: new Types.ObjectId(targetId),
          type: modelType
        }
      })
      .exec();

    if (existingPetitionReceiver && isEmitterCreator && existingPetitionReceiver.status == PetitionStatus.Declined) {
      throw new BadRequestException("Invitación previamente rechazada");
    }
    else if (existingPetitionReceiver && isEmitterCreator) {
      throw new BadRequestException(
        `Ya existe una invitación a este usuario para este ${translate[modelType]}`,
      );
    }


    // Verificar si el partido ya ha alcanzado el límite de jugadores, si ya tiene el cupo lleno no podemos enviar solicitud para jugar
    if (target.playersLimit && target.users.length >= target.playersLimit) {
      throw new BadRequestException(
        "Ya ha alcanzado el límite de jugadores",
      );
    }

    // Crear la petición
    const newPetition = new this.petitionModel({
      emitter: emitterExist._id,
      receiver: receiverExist._id,
      reference: {
        id: target._id,
        type: modelType,
      },
      status: PetitionStatus.Pending,
    });
    await newPetition.save();

    // ─────────────────────────────── Push‑notification (best‑effort)
    if (receiverExist.pushToken) {
      const message = isEmitterCreator
        ? `${emitterExist.name} ha solicitado que te unas a su ${translate[modelType]}.`
        : `${emitterExist.name} ha solicitado unirse a tu ${translate[modelType]}.`;
      await this.notificationService.sendPushNotification(
        [receiverExist.pushToken],
        `Nueva solicitud para unirse al ${translate[modelType]}`,
        message,
        { petitionId: newPetition._id.toString() },
      );
    }

    return newPetition;
  }

  async findByReference(reference: { id: Types.ObjectId; type: PetitionModelType }): Promise<Petition[]> {
    return this.petitionModel
      .find({
        'reference.id': reference.id,
        'reference.type': reference.type,
      })
      .populate('receiver')
      .exec();
  }

  /**
 * Acepta un nueva petición (o invitación) asociada a un partido o a un grupo.
 *
 * ### Regla de negocio básica
 * - **Petición**: el *emitter* NO es administrador del recurso ⇒ solicita unirse.
 * - **Invitación**: el *emitter* SÍ es administrador ⇒ invita a otro usuario.
 *
 * Si es una petición agrega al emisor al recurso, si es una invitación agrega al receptor al recurso
 *
 * @param petitionId – `Types.ObjectId`
 * @returns El recurso de la petición
 *
 * @throws NotFoundException    Si petición, recurso, emisor o receptor no es encontrado
 * @throws BadRequestException  – Petición/Invitación ya procesada
 *                              – Petición/invitación antes rechazada
 *                              - El usuario ya se encuentra en el partido
 *                              – Cupo del recurso completo
 *                              – Tipo de referencia no soportado
 *                              - Emisor y receptor son el mismo usuairo
 */
  async acceptPetition(petitionId: Types.ObjectId): Promise<Match | Group> {
    // Buscar la petición por su ID

    const petition: Petition = await this.petitionModel
      .findById(petitionId)
      .populate("emitter")
      .populate("receiver")
      .populate("reference.id")
      .exec();

    if (!petition) {
      throw new NotFoundException("Solicitud no encontrada");
    }

    const modelType = petition?.reference?.type
    const targetId = petition?.reference?.id

    // Ahora 'match' y 'emitter' son objetos completos, no solo IDs

    const handler = this.modelHandlers[modelType];
    if (!handler) {
      throw new BadRequestException("Tipo de referencia no soportado");
    }
    const target = await handler.model.findById(targetId).exec();
    const emitter: User = await this.userModel.findById(petition.emitter._id).exec();
    const receiver: User = await this.userModel
      .findById(petition.receiver._id)
      .exec();

    if (!target) {
      throw new NotFoundException("Recurso no encontrado");
    }

    if (!emitter) {
      throw new NotFoundException("Emisor no encontrado");
    }

    if (!receiver) {
      throw new NotFoundException("Receptor no encontrado");
    }

    if (petition.status !== PetitionStatus.Pending) {
      throw new BadRequestException("La solicitud ya ha sido procesada");
    }
    if ((petition.receiver._id as Types.ObjectId).equals(petition.emitter._id as Types.ObjectId)) {
      throw new BadRequestException("no pueden ser el emisor y el receptor el mismo usuario");
    }

    // Verificar si el partido ya ha alcanzado el límite de jugadores
    if (target.playersLimit && target.users.length >= target.playersLimit) {
      throw new BadRequestException(
        "No se puede aceptar la solicitud porque el partido ya ha alcanzado el límite de jugadores",
      );
    }
    const isEmitterOwner = (target.userId as Types.ObjectId).equals(petition.emitter._id as Types.ObjectId)

    let match: Match = null
    let tokens: string[] = null
    const usersToSendPush: Types.ObjectId[] = [...(target.users as Types.ObjectId[])];
    // ─────────────────────────────── Si el emisor es el admin del partido 
    // Si el emisor es el creador del partido, agregar al receptor en lugar del emisor
    if (isEmitterOwner) {
      if (target.users.includes(petition.receiver._id)) {
        throw new BadRequestException(`El usuario ya se encuentra en el ${translate[modelType]}`)
      }
      // Actualización atómica: se agrega el receptor solo si no está presente
      await handler.model
        .findByIdAndUpdate(targetId, { $addToSet: { users: petition.receiver._id } })
        .exec();
      if (modelType === PetitionModelType.match) {
        this.activityService.create({
          matchId: targetId,
          description: `Se unió ${receiver.name} al partido`
        })

        match = await this.matchModel.findById(targetId).exec()

        tokens = await this.userService.getTokenUsersIdsList(usersToSendPush)
        await this.notificationService.sendPushNotification(
          tokens,
          `Partido ${match.name}`,
          `Se unió ${receiver.name} al partido`,
          { matchId: petitionId.toString() },
        );
      }


      // Agregar el partido al array de partidos o grupos del receiver si no es el dueño
      if (!receiver[plural[modelType]].includes(target.id)) {
        receiver[plural[modelType]].push(target.id); // Agregar el partido al array de `matches` o `groups` del receiver
        await receiver.save(); // Guardar los cambios en el receptor
      }

    }
    // ─────────────────────────────── Si el receptor es el admin del partido
    else {
      if (target.users.includes(petition.emitter._id)) {
        throw new BadRequestException(`El usuario ya se encuentra en el ${translate[modelType]}`)
      }
      // Actualización atómica: se agrega el emisor solo si no está presente
      await handler.model
        .findByIdAndUpdate(targetId, { $addToSet: { users: petition.emitter._id } })
        .exec();
      if (modelType === PetitionModelType.match) {
        this.activityService.create({
          matchId: targetId,
          description: `Se unió ${emitter.name} al partido`
        })

        if (!match) match = await this.matchModel.findById(targetId).exec()

        if (!tokens) tokens = await this.userService.getTokenUsersIdsList(usersToSendPush)

        await this.notificationService.sendPushNotification(
          tokens,
          `Partido ${match.name}`,
          `Se unió ${receiver.name} al partido`,
          { matchId: petitionId.toString() },
        );

      }

      // Agregar el partido al array de partidos del emisor
      if (!emitter[plural[modelType]].includes(target.id)) {
        emitter[plural[modelType]].push(target.id); // Agregar el grupo/partido al array de `matches`/groups del emisor
        await emitter.save(); // Guardar los cambios en el emisor
      }
    }
    // Marcar la solicitud como aceptada
    petition.status = PetitionStatus.Accepted;
    await petition.save();

    // Enviar notificación al emisor (emitter) de que su petición ha sido aceptada

    if (emitter.pushToken) {
      let notificationMessage: string
      // Si el emisor es el admin del partido
      if (isEmitterOwner) {
        notificationMessage = `Tu invitación  al ${translate[modelType]} ha sido aceptada.`
      }
      // Si el receptor es el admin del partido
      else {
        notificationMessage = `Tu solicitud para unirte al ${translate[modelType]} ha sido aceptada.`
      }

      await this.notificationService.sendPushNotification(
        [emitter.pushToken],
        "Solicitud Aceptada",
        notificationMessage,
        { id: target._id.toString() }
      );
    }
    return target;
  }

  /**
* Rechaza un nueva petición (o invitación) asociada a un partido o a un grupo.
*
* ### Regla de negocio básica
* - **Petición**: el *emitter* NO es administrador del recurso ⇒ solicita unirse.
* - **Invitación**: el *emitter* SÍ es administrador ⇒ invita a otro usuario.
*
*
* @param petitionId -Types.ObjectID
* @returns La petición
*
* @throws NotFoundException    Si petición, recurso, emisor o receptor no es encontrado
* @throws BadRequestException  – Petición/Invitación ya procesada
*                              – Petición/invitación antes rechazada
*                              - El usuario ya se encuentra en el partido
*                              – Cupo del recurso completo
*                              – Tipo de referencia no soportado
*                              - Emisor y receptor son el mimso usuario
*/
  async declinePetition(petitionId: Types.ObjectId): Promise<Petition> {
    const petition = await this.petitionModel.findById(petitionId).exec();

    if (!petition) {
      throw new NotFoundException("Solicitud no encontrada");
    }
    const modelType = petition?.reference?.type
    const targetId = petition?.reference?.id
    const handler = this.modelHandlers[modelType];
    if (!handler) {
      throw new BadRequestException("Petición corrupta");
    }
    const target = await handler.model.findById(targetId).exec();
    const emitter: User = await this.userModel.findById(petition.emitter._id).exec();
    const receiver: User = await this.userModel
      .findById(petition.receiver._id)
      .exec();

    
    if (!target) {
      throw new NotFoundException("Recurso no encontrado");
    }

    if (!emitter) {
      throw new NotFoundException("Emisor no encontrado");
    }

    if (!receiver) {
      throw new NotFoundException("Receptor no encontrado");
    }
  

    if (petition.status !== PetitionStatus.Pending) {
      throw new BadRequestException("La solicitud ya ha sido procesada");
    }
    if ((petition.receiver._id as Types.ObjectId).equals(petition.emitter._id as Types.ObjectId)) {
      throw new BadRequestException("No pueden ser el emisor y el receptor el mismo usuario");
    }


    // Marcar la solicitud como rechazada
    petition.status = PetitionStatus.Declined;

    await petition.save();



    // Enviar notificación al emisor (emitter) de que su petición ha sido rechazada
  
    const isEmitterOwner = (target.userId as Types.ObjectId).equals(petition.emitter._id as Types.ObjectId)
    if (emitter?.pushToken) {
      let message: string = ""
      if (isEmitterOwner) {
        message = `Han rechazado tu invitación`
      }
      else {
        message = `Tu solicitud para unirte ha sido rechazada.`
      }
      await this.notificationService.sendPushNotification(
        [emitter.pushToken],
        "Solicitud Rechazada",
        message,
        { petitionId: petition._id.toString() },
      );
    }

    return petition;
  }

  async findExistingPetition(
    emitterId: string,
    targetId: string,
    modelType: PetitionModelType
  ): Promise<Petition | null> {
    const existingPetition = await this.petitionModel
      .findOne({
        emitter: new Types.ObjectId(emitterId),
        reference: {
          id: new Types.ObjectId(targetId),
          type: modelType
        }
      })
      .exec();

    return existingPetition;
  }

  async findAll(filter: Filter): Promise<FilterResponse<Petition>> {
    const results = await this.petitionModel.find(filter).populate("receiver emitter").exec();
    return {
      results,
      totalCount: await this.petitionModel.countDocuments(filter).exec()
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} peticione`;
  }

  update(id: number, updatePetitionDto: UpdatePetitionDto) {
    return `This action updates a #${id} peticione`;
  }

  remove(id: number) {
    return `This action removes a #${id} peticione`;
  }

  async removeAllOfOneMatch(matchId: Types.ObjectId) {
    const result = await this.petitionModel.deleteMany({
      'reference.type': PetitionModelType.match,
      'reference.id': matchId,
    });
    if (result.deletedCount === 0) {
      throw new NotFoundException('No se encontró ninguna petición para eliminar.');
    }
    return { message: `Se eliminaron ${result.deletedCount} peticiones correctamente.` };
  }
}
