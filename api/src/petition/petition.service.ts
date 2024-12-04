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
import { Model, Types } from "mongoose";
import { PetitionStatus } from "./petition.enum";
import { FindManyFilter } from "filter/filter.dto";
import { PushNotificationService } from "services/pushNotificationservice";

@Injectable()
export class PetitionService {
  constructor(
    @InjectModel(Petition.name) private readonly petitionModel: Model<Petition>,
    @InjectModel(Match.name) private readonly matchModel: Model<Match>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly notificationService: PushNotificationService,
  ) {}

  async create(createPetitionDto: CreatePetitionDto): Promise<Petition> {
    const { emitter, receiver, match } = createPetitionDto;
    // Verificar que el usuario solicitante, destinatario, y partido existan

    const emitterExist = await this.userModel.findById(emitter).exec();
    //console.log("emisor", emitterExist);
    const receiverExist = await this.userModel.findById(receiver).exec();
    //console.log("receptor", receiverExist);
    const matchExist = await this.matchModel.findById(match).exec();
    //console.log("partido", match);

    if (!emitterExist) {
      throw new NotFoundException("EMISOR de la peticion no encontrado");
    }

    if (!receiverExist) {
      throw new NotFoundException("RECEPTOR de la peticion no encontrado");
    }

    if (!matchExist) {
      throw new NotFoundException("PARTIDO no encontrado");
    }

    // Verificar si el emisor es el creador del partido
    const isEmitterCreator = new Types.ObjectId(matchExist.userId).equals(
      emitterExist.id,
    );

    // Verificar si ya existe una petición con el mismo emitter y match
    const existingPetition = await this.petitionModel
      .findOne({
        emitter: new Types.ObjectId(emitter),
        match: new Types.ObjectId(match),
      })
      .exec();

    if (
      existingPetition &&
      existingPetition.status == PetitionStatus.Declined
    ) {
      throw new BadRequestException("ANDA PA'ALLA BOBO");
    } else if (existingPetition && !isEmitterCreator) {
      // Si no es el creador y ya existe una solicitud, se lanza la excepción
      throw new BadRequestException(
        "Ya existe una petición de este usuario para este partido",
      );
    }

    // Verificar si el partido ya ha alcanzado el límite de jugadores, si ya tiene el cupo lleno no podemos enviar solicitud para jugar
    if (matchExist.users.length >= matchExist.playersLimit) {
      throw new BadRequestException(
        "El partido ya ha alcanzado el límite de jugadores",
      );
    }

    // Crear la petición
    const newPetition = new this.petitionModel({
      emitter: emitterExist._id,
      receiver: receiverExist._id,
      match: matchExist._id,
      status: PetitionStatus.Pending,
    });

    await newPetition.save();

    // Enviar notificación al receptor (receiver) de la petición
    if (receiverExist.pushToken) {
      const message = isEmitterCreator
        ? `${emitterExist.name} ha solicitado que te unas a su partido.`
        : `${emitterExist.name} ha solicitado unirse a tu partido.`;

      await this.notificationService.sendPushNotification(
        [receiverExist.pushToken],
        "Nueva solicitud para unirse al partido",
        message,
        { petitionId: newPetition._id.toString() },
      );
    }

    return newPetition;
  }

  async acceptPetition(petitionId: Types.ObjectId): Promise<Match> {
    // Buscar la petición por su ID
    const petition = await this.petitionModel
      .findById(petitionId)
      .populate("emitter")
      .populate("receiver")
      .populate("match")
      .exec();

    if (!petition) {
      throw new NotFoundException("Solicitud no encontrada");
    }

    // Ahora 'match' y 'emitter' son objetos completos, no solo IDs

    const match = await this.matchModel.findById(petition.match._id).exec();
    const emitter = await this.userModel.findById(petition.emitter._id).exec();
    const receiver = await this.userModel
      .findById(petition.receiver._id)
      .exec();

    if (!match) {
      throw new NotFoundException("Partido no encontrado");
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

    // Verificar si el partido ya ha alcanzado el límite de jugadores
    if (match.users.length >= match.playersLimit) {
      throw new BadRequestException(
        "No se puede aceptar la solicitud porque el partido ya ha alcanzado el límite de jugadores",
      );
    }

    // Si el emisor es el creador del partido, agregar al receptor en lugar del emisor
    if (match.userId.equals(petition.emitter._id)) {
      match.users.push(petition.receiver._id);

      // Agregar el partido al array de partidos del receiver si no es el dueño
      if (!match.userId.equals(petition.receiver._id)) {
        if (!receiver.matches.includes(match.id)) {
          receiver.matches.push(match.id); // Agregar el partido al array de `matches` del receiver
          await receiver.save(); // Guardar los cambios en el receptor
        }
      }
    } else {
      // En caso contrario, agregar al emisor al partido
      match.users.push(petition.emitter._id);

      // Agregar el partido al array de partidos del emisor
      if (!emitter.matches.includes(match.id)) {
        emitter.matches.push(match.id); // Agregar el partido al array de `matches` del emisor
        await emitter.save(); // Guardar los cambios en el emisor
      }
    }
    // Marcar la solicitud como aceptada
    petition.status = PetitionStatus.Accepted;

    await match.save();
    await petition.save();

    // Enviar notificación al emisor (emitter) de que su petición ha sido aceptada
    if (emitter.pushToken) {
      await this.notificationService.sendPushNotification(
        [emitter.pushToken],
        "Solicitud Aceptada",
        `Tu solicitud para unirte al partido ha sido aceptada.`,
        { matchId: match._id.toString() },
      );
    }

    return match;
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
        `Tu solicitud para unirte al partido ha sido rechazada.`,
        { petitionId: petition._id.toString() },
      );
    }

    return petition;
  }

  async findExistingPetition(
    emitterId: string,
    matchId: string,
  ): Promise<Petition | null> {
    const existingPetition = await this.petitionModel
      .findOne({
        emitter: new Types.ObjectId(emitterId),
        match: new Types.ObjectId(matchId),
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
