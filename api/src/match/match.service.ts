import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateMatchDto } from "./match.dto";
import { UpdateMatchDto } from "./match.dto";
import { Match } from "./match.entity";
import { User } from "user/user.entity";
import { Location } from "locations/location.entity";
import { ObjectId } from "mongodb";
import { PetitionService } from "petition/petition.service";
import { PetitionStatus } from "petition/petition.enum";
import { Filter, FilterResponse } from "types/types";

@Injectable()
export class MatchService {
  constructor(
    @InjectModel(Match.name) private readonly matchModel: Model<Match>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Location.name) private readonly locationModel: Model<Location>,
    private readonly petitionService: PetitionService,
  ) {}

  // Servicio para crear partido, con o sin invitaciones
  async createMatch(createMatchDto: CreateMatchDto): Promise<Match> {
    const { userId, invitedUsers, location, ...matchData } = createMatchDto;

    // Verificar si el usuario creador existe
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }

    // Verificar si la location existe
    const locationExist = await this.locationModel.findById(location).exec();
    if (!locationExist) {
      throw new NotFoundException("Ubicación no encontrada");
    }

    // Crear el partido e incluir al creador en la lista de users
    const match = new this.matchModel({
      ...matchData,
      userId: user._id,
      users: [user._id],
      location: location,
    });

    const savedMatch = await match.save();

    // Agregar el partido al array de matches de la location
    locationExist.matches.push(savedMatch.id);
    await locationExist.save();

    // Agregar el partido al array de matches del creador (usuario)
    user.matches.push(savedMatch.id);
    await user.save(); // Guardar los cambios en el usuario

    // Si se proporcionan usuarios invitados, creamos las peticiones
    if (invitedUsers && invitedUsers.length > 0) {
      for (const invitedUserId of invitedUsers) {
        const invitedUser = await this.userModel.findById(invitedUserId).exec();
        if (!invitedUser) {
          throw new NotFoundException(
            `Usuario con ID ${invitedUserId} no encontrado`,
          );
        }

        // Crear la petición asegurando que receiver y match sean ObjectId
        await this.petitionService.create({
          emitter: user.id, // El creador del partido es el emisor
          receiver: new ObjectId(invitedUserId), // Convertir receiver a ObjectId
          match: savedMatch.id,
          status: PetitionStatus.Pending,
        });
      }
    }

    return savedMatch;
  }

  async addUserToMatch(matchId: ObjectId, userId: ObjectId): Promise<Match> {
    const match = await this.matchModel.findById(matchId).exec();
    const user = await this.userModel.findById(userId).exec();

    if (!match || !user) {
      throw new NotFoundException("match or User not found");
    }

    // Verifica si el usuario ya está en la lista del match
    if (match.users.some((u) => u.toString() === userId.toString())) {
      throw new BadRequestException("El usuario ya está agregado al match");
    }

    match.users.push(userId);

    return match.save();
  }

  async removeUserFromMatch(
    matchId: ObjectId,
    userId: ObjectId,
  ): Promise<Match> {
    // Buscar el partido por su ID
    const match = await this.matchModel.findById(matchId).exec();
    if (!match) {
      throw new NotFoundException("Partido no encontrado");
    }

    // Buscar el usuario por su ID
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }

    // Verificar si el usuario está en la lista de usuarios del partido
    const userIndex = match.users.findIndex(
      (u) => u.toString() === userId.toString(),
    );

    if (userIndex === -1) {
      throw new BadRequestException("El usuario no está en el partido");
    }

    // Eliminar el usuario de la lista de usuarios del partido
    match.users.splice(userIndex, 1);

    // Guardar el partido actualizado
    await match.save();

    // Eliminar el matchId del array de partidos del usuario
    const matchIndex = user.matches.findIndex(
      (m) => m.toString() === matchId.toString(), // Comparar como cadenas
    );

    // Remover el partido de la lista de partidos del usuario
    if (matchIndex !== -1) {
      user.matches.splice(matchIndex, 1);
    }
    // Guardar el usuario actualizado
    await user.save();

    return match;
  }

  async findAll(filter: Filter): Promise<Match[]> {        
    return this.matchModel.find(filter)
  }

  async findOne(id: ObjectId): Promise<Match> {
    const match = await this.matchModel
      .findById(id)
      .populate("location")
      .populate("users")
      .exec();

    if (!match) {
      throw new NotFoundException(`Partido #${id} not found`);
    }
    return match;
  }

  async update(id: ObjectId, updateMatchDto: UpdateMatchDto): Promise<Match> {
    const match = await this.matchModel
      .findByIdAndUpdate(id, updateMatchDto, {
        new: true,
      })
      .exec();

    if (!match) {
      throw new NotFoundException(`Match #${id} not found`);
    }

    return match;
  }

  async remove(id: ObjectId): Promise<void> {
    // 1. Buscar el partido y poblar la lista de usuarios asociados al partido
    const match = await this.matchModel
      .findById(id)
      .populate({
        path: "users", // Poblar la lista de usuarios
        select: "matches", // Solo seleccionamos el campo 'matches' de los usuarios
      })
      .exec();

    if (!match) {
      throw new NotFoundException(`Partido con ID ${id} no encontrado`);
    }

    // 2. Aseguramos que el campo `users` es un array de documentos completos de User
    const users = match.users as unknown as Array<
      User & { matches: ObjectId[] }
    >; // Conversión explícita para evitar errores de tipo

    // 3. Para cada usuario, remover el partido de su lista de matches y guardar cambios
    for (const user of users) {
      const matchIndex = user.matches.findIndex(
        (m) => m.toString() === id.toString(),
      );

      // Si el partido está en el array `matches`, lo eliminamos
      if (matchIndex !== -1) {
        user.matches.splice(matchIndex, 1); // Remover el partido del array de matches del usuario
        await user.save(); // Guardar los cambios en cada usuario
      }
    }

    // 4. Eliminar el partido de las ubicaciones que lo tienen en su lista de partidos
    const locations = await this.locationModel.find({ matches: id }).exec();

    for (const location of locations) {
      const matchIndex = location.matches.findIndex(
        (m) => m.toString() === id.toString(),
      );

      if (matchIndex !== -1) {
        location.matches.splice(matchIndex, 1);
        await location.save(); // Guardar los cambios de la ubicación
      }
    }

    // 5. Finalmente, eliminamos el partido de la colección `matches`
    await this.matchModel.findByIdAndDelete(id).exec();
  }

  async findAllByStatus(): Promise<{ active: Match[]; inactive: Match[] }> {
    let now = new Date();

    const matches = await this.matchModel.aggregate([
      {
        $facet: {
          active: [{ $match: { date: { $gt: now } } }],
          inactive: [{ $match: { date: { $lt: now } } }],
        },
      },
    ]);

    return matches[0];
  }

  async getAvailableMatches(): Promise<any> {
    const now = new Date();

    return await this.matchModel
      .find({
        date: { $gte: now },
        $expr: { $lt: [{ $size: "$users" }, "$playersLimit"] },
      })
      .populate("location");
  }
}
