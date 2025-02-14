import {
  BadRequestException,
  forwardRef,
  Inject,
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
import { MatchService } from "match/match.service";
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
    @InjectModel(Group.name) private readonly gorupModel: Model<Group>,
    private readonly notificationService: PushNotificationService,
    @Inject(forwardRef(() => MatchService))
    private readonly matchService: MatchService,
  ) {}

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
      model: this.gorupModel,
      validate: async (target) => {
        if (!target) {
          throw new NotFoundException("GRUPO no encontrado");
        }
      },
    },
  };

  async create(createPetitionDto: CreatePetitionDto): Promise<Petition> {
    const { emitter, receiver, reference } = createPetitionDto;
    const targetId = reference.id;
    const modelType = reference.type;

    // Verificar que el usuario solicitante, destinatario, y partido existan

    const emitterExist = await this.userModel.findById(emitter).exec();
    const receiverExist = await this.userModel.findById(receiver).exec();

    //TODO: Abstract logic onto guards, should exist guard

    if (!emitterExist) {
      throw new NotFoundException("EMISOR de la peticion no encontrado");
    }

    if (!receiverExist) {
      throw new NotFoundException("RECEPTOR de la peticion no encontrado");
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
    const existingPetition = await this.petitionModel
      .findOne({
        emitter: new Types.ObjectId(emitter),
        reference: {
          id: new Types.ObjectId(targetId),
          type: modelType,
        },
      })
      .exec();

    if (
      existingPetition &&
      existingPetition.status == PetitionStatus.Declined
    ) {
      throw new BadRequestException("Petición previamente rechazada");
    } else if (existingPetition && !isEmitterCreator) {
      // Si no es el creador y ya existe una solicitud, se lanza la excepción
      throw new BadRequestException(
        `Ya existe una petición de este usuario para este ${translate[modelType]}`,
      );
    }

    // Verificar si el partido ya ha alcanzado el límite de jugadores, si ya tiene el cupo lleno no podemos enviar solicitud para jugar
    if (target.playersLimit && target.users.length >= target.playersLimit) {
      throw new BadRequestException("Ya ha alcanzado el límite de jugadores");
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

    const modelType = petition?.reference?.type;
    const targetId = petition?.reference?.id;

    // Ahora 'match' y 'emitter' son objetos completos, no solo IDs

    const handler = this.modelHandlers[modelType];
    if (!handler) {
      throw new BadRequestException("Tipo de referencia no soportado");
    }
    const target = await handler.model.findById(targetId).exec();
    const emitter: User = await this.userModel
      .findById(petition.emitter._id)
      .exec();
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

    // Si el emisor es el creador del partido, agregar al receptor en lugar del emisor
    if (
      (target.userId as Types.ObjectId).equals(
        petition.emitter._id as Types.ObjectId,
      )
    ) {
      if (target.users.includes(petition.receiver._id)) {
        throw new BadRequestException(
          `El usuario ya se encuentra en el ${translate[modelType]}`,
        );
      }
      if (modelType === PetitionModelType.match) {
        this.matchService.addUserToMatch(targetId, petition.receiver._id);
      } else {
        target.users.push(petition.receiver._id);
      }

      // Agregar el partido al array de partidos o grupos del receiver si no es el dueño
      if (!(target.userId as Types.ObjectId).equals(petition.receiver._id)) {
        if (!receiver[plural[modelType]].includes(target.id)) {
          receiver[plural[modelType]].push(target.id); // Agregar el partido al array de `matches` o `groups` del receiver
          await receiver.save(); // Guardar los cambios en el receptor
        }
      }
    } else {
      if (target.users.includes(petition.emitter._id)) {
        throw new BadRequestException(
          `El usuario ya se encuentra en el ${translate[modelType]}`,
        );
      }
      // En caso contrario, agregar al emisor al partido
      if (modelType === PetitionModelType.match) {
        this.matchService.addUserToMatch(targetId, petition.emitter._id);
      } else {
        target.users.push(petition.emitter._id);
      }

      // Agregar el partido al array de partidos del emisor
      if (!emitter[plural[modelType]].includes(target.id)) {
        emitter[plural[modelType]].push(target.id); // Agregar el grupo/partido al array de `matches`/groups del emisor
        await emitter.save(); // Guardar los cambios en el emisor
      }
    }
    // Marcar la solicitud como aceptada
    petition.status = PetitionStatus.Accepted;

    await target.save();
    await petition.save();

    // Enviar notificación al emisor (emitter) de que su petición ha sido aceptada
    if (emitter.pushToken) {
      const notificationMessage = `Tu solicitud para unirte al ${translate[modelType]} ha sido aceptada.`;
      await this.notificationService.sendPushNotification(
        [emitter.pushToken],
        "Solicitud Aceptada",
        notificationMessage,
        { id: target._id.toString() },
      );
    }
    return target;
  }

  async declinePetition(petitionId: Types.ObjectId): Promise<Petition> {
    const petition = await this.petitionModel.findById(petitionId).exec();

    if (!petition) {
      throw new NotFoundException("Solicitud no encontrada");
    }

    if (petition.status !== PetitionStatus.Pending) {
      throw new BadRequestException("La solicitud ya ha sido procesada");
    }

    // Marcar la solicitud como rechazada
    petition.status = PetitionStatus.Declined;

    await petition.save();

    // Enviar notificación al emisor (emitter) de que su petición ha sido rechazada
    const emitter = await this.userModel.findById(petition.emitter).exec();
    if (emitter?.pushToken) {
      await this.notificationService.sendPushNotification(
        [emitter.pushToken],
        "Solicitud Rechazada",
        `Tu solicitud para unirte ha sido rechazada.`,
        { petitionId: petition._id.toString() },
      );
    }

    return petition;
  }

  async findExistingPetition(
    emitterId: string,
    targetId: string,
    modelType: PetitionModelType,
  ): Promise<Petition | null> {
    const existingPetition = await this.petitionModel
      .findOne({
        emitter: new Types.ObjectId(emitterId),
        reference: {
          id: new Types.ObjectId(targetId),
          type: modelType,
        },
      })
      .exec();

    return existingPetition;
  }

  async findAll(options?: FindManyFilter<Petition>): Promise<Petition[]> {
    const petitions = await this.petitionModel.find(options).exec();
    return petitions;
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
}
