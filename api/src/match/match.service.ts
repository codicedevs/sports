import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { model, Model, Types } from "mongoose";
import { CreateMatchDto, MatchDto, } from "./match.dto";
import { UpdateMatchDto } from "./match.dto";
import { Formations, Match, Player } from "./match.entity";
import { User } from "user/user.entity";
import { Location } from "locations/location.entity";
import { ObjectId } from "mongodb";
import { PetitionService } from "petition/petition.service";
import { PetitionModelType, PetitionStatus } from "petition/petition.enum";
import { Filter, FilterResponse } from "types/types";
import * as moment from "moment-timezone"; // Para manejar zonas horarias
import { Zone } from "zones/entities/zone.entity";
import { SportModesService } from "sport_modes/sport_modes.service";
import { SportMode } from "sport_modes/entities/sport_mode.entity";
import { PushNotificationService } from "services/pushNotificationservice";
import { LocationsService } from "locations/locations.service";

@Injectable()
export class MatchService {
  constructor(
    @InjectModel(Match.name) private readonly matchModel: Model<Match>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Location.name) private readonly locationModel: Model<Location>,
    private readonly petitionService: PetitionService,
    private readonly locationsService: LocationsService,
    private readonly sportModesService: SportModesService,
    private readonly pushNotificationService: PushNotificationService
  ) { }

  // Servicio para crear partido, con o sin invitaciones
  async createMatch(createMatchDto: CreateMatchDto): Promise<Match> {
    const { userId, invitedUsers, location, ...matchData } = createMatchDto;
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException("ID de usuario inválido");
    }
    // Verificar si el usuario creador existe
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }

    if (!Types.ObjectId.isValid(location as Types.ObjectId)) {
      throw new BadRequestException("ID de location inválida");
    }
    // Verificar si la location existe
    
    const locationExist = await this.locationModel.findById(location).exec();
    
    if (!locationExist) {
      throw new NotFoundException("Ubicación no encontrada");
    }
    const date = moment.tz(matchData.date, 'America/Argentina/Buenos_Aires').toDate();
    // Crear el partido e incluir al creador en la lista de users
    const match = new this.matchModel({
      ...matchData,
      userId: user._id,
      users: [user._id],
      location: location,
      dayOfWeek: date.getDay(),
      hour: date.getHours(),

    })
    const matchDto: MatchDto = {
      ...createMatchDto,
      location: location,
      dayOfWeek: date.getDay(),
      hour: date.getHours(),
    }

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
          reference: {
            id: savedMatch.id,
            type: PetitionModelType.match
          },
          status: PetitionStatus.Pending,
        });
      }
    }
    if (match.open === true) {
      const eligibleUsers: User[] = await this.getUsersForMatchRecommendations(matchDto)
      // Filtrar usuarios con `expoPushToken`
      const tokens = eligibleUsers
        .map((user) => user.pushToken)
        .filter((token) => !!token);


      if (tokens.length > 0) {
        const title = '¡Nuevo partido disponible!';
        const body = `Un partido está abierto. ¡Únete ahora!`;

        await this.pushNotificationService.sendPushNotification(
          tokens,
          title,
          body,
          { matchId: match.id }, // Puedes incluir más datos
        );

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

  async findAll(filter: Filter): Promise<FilterResponse<Match>> {
    const results = await this.matchModel.find(filter).limit(0)
    return {
      results,
      total: await this.matchModel.countDocuments(filter)
    }
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


  //Lo dejamos por las dudas, pero a priori no lo vamos a usar, filtra por la disponibilidad horaria del usuario
  async getMatchesForUserDate(userId: string): Promise<Match[]> {
    // Paso 1: Obtener la disponibilidad del usuario
    const user = await this.userModel
      .findById(userId)
      .select('profile.availability')
      .exec();

    if (!user || !user.profile?.availability) {
      throw new Error('User not found or no availability defined.');
    }

    // Paso 2: Procesar disponibilidad
    const availabilityFilters = user.profile.availability.map((availability) => {
      const { day, intervals } = availability;

      // Convertir día de la semana a índices
      const dayIndex = this.getDayIndex(day);

      return {
        dayIndex,
        intervals,
      };
    });

    // Paso 3: Construir la consulta


    const matches = await this.matchModel.aggregate([
      {
        $match: {
          $or: availabilityFilters.map(({ dayIndex, intervals }) => ({
            dayOfWeek: dayIndex,  // Usamos dayOfWeek que ya está en UTC-3
            $or: intervals.map((interval) => ({
              hour: { $gte: interval.startHour, $lt: interval.endHour }, // Usamos hour que ya está en UTC-3
            })),
          })),
        },
      },
    ]);

    return matches;
  }

  //Lo dejamos por las dudas, pero a priori no lo vamos a usar, filtra por la zona del usuario
  async getMatchesInUserZones(userId: string): Promise<Match[]> {
    // Obtener el usuario con sus zonas preferidas
    const user = await this.userModel
      .findById(userId)
      .populate('profile.preferredZones')
      .exec();

    if (!user || !user.profile?.preferredZones?.length) {
      throw new NotFoundException(
        'El usuario no tiene zonas preferidas o no existe.',
      );
    }

    const zones = user.profile.preferredZones as Zone[];

    // Crear una lista de polígonos de las zonas preferidas
    const zonePolygons = zones.map((zone: Zone) => zone.location);

    const matches = await this.matchModel.aggregate([
      {
        $lookup: {
          from: "locations", // Nombre de la colección de Location
          localField: "location", // Campo en Match que referencia a Location
          foreignField: "_id", // Campo en Location que se corresponde con el ID
          as: "locationDetails", // Alias para los datos combinados
        },
      },
      {
        $unwind: "$locationDetails", // Descomponemos para acceder a los datos de Location
      },
      {
        $match: {
          "locationDetails.location": {
            $geoWithin: {
              $geometry: {
                type: "MultiPolygon",
                coordinates: zonePolygons.map((polygon) => polygon.coordinates),
              },
            },
          },
        },
      }
    ]);


    return matches;
  }

  //Lo dejamos por las dudas, pero a priori no lo vamos a usar, filtra por la modalidad de deporte preferida del usuario
  async getMatchesByUserSportMode(userId: string): Promise<Match[]> {
    // Paso 1: Obtener los modos de deporte preferidos del usuario
    const user = await this.userModel
      .findById(userId)
      .select('profile.preferredSportModes') // Solo traer el campo necesario
      .exec();

    if (!user || !user.profile?.preferredSportModes?.length) {
      throw new NotFoundException(
        'El usuario no tiene modos de deporte preferidos o no existe.',
      );
    }

    const preferredSportModes = user.profile.preferredSportModes;

    // Paso 2: Buscar los partidos que coincidan con los sportModes preferidos
    const matches = await this.matchModel
      .find({
        sportMode: { $in: preferredSportModes }, // Condición para buscar los sportModes preferidos
      })
      .exec();

    return matches;
  }


  async getMatchesForUserRecommendation(userId: string): Promise<Match[]> {
    // Obtener información del usuario
    const user = await this.userModel
      .findById(userId)
      .populate('profile.preferredZones profile.preferredSportModes')
      .select('profile.availability profile.preferredZones profile.preferredSportModes profile.preferredSports')
      .exec();

    if (!user) {
      throw new Error('User not found.');
    }

    // Validar disponibilidad y zonas preferidas
    const availability = user.profile?.availability || [];
    const preferredZones = (user.profile?.preferredZones as Zone[]) || [];

    if (!availability.length || !preferredZones.length) {
      throw new Error('User has no availability or preferred zones.');
    }

    // Procesar disponibilidad
    let availabilityFilters = user.profile.availability.map((availability) => {
      const { day, intervals } = availability;

      // Convertir día de la semana a índices
      const dayIndex = this.getDayIndex(day);

      return {
        dayIndex,
        intervals,
      };
    });

    let preferredSportModes: SportMode[] = (user.profile?.preferredSportModes as SportMode[]) || []
    if (preferredSportModes.length == 0) {
      preferredSportModes = (await this.sportModesService.findForSports(user.profile.preferredSports as ObjectId[])) as SportMode[]
    }


    // Crear coordenadas de zonas preferidas
    const zonePolygons = preferredZones.map((zone: Zone) => zone.location);

    // Pipeline de agregación
    const matches = await this.matchModel.aggregate([
      {
        $match: {
          open: true
        }

      },
      // Combinar con Location
      {
        $lookup: {
          from: 'locations', // Colección de Location
          localField: 'location', // Campo en Match
          foreignField: '_id', // Campo en Location
          as: 'location',
        },
      },
      { $unwind: '$location' }, // Descomponer array de ubicación
      // Filtro por zonas

      ...(zonePolygons.length > 0 ? [{
        $match: {
          'location.location': {
            $geoWithin: {
              $geometry: {
                type: 'MultiPolygon',
                coordinates: zonePolygons.map((polygon) => polygon.coordinates),
              },
            },
          },
        },
      }] : []),

      // Filtro por disponibilidad
      ...(availabilityFilters.length > 0 ? [{
        $match: {
          $or: availabilityFilters.map(({ dayIndex, intervals }) => ({
            dayOfWeek: dayIndex,  // Usamos dayOfWeek que ya está en UTC-3
            $or: intervals.map((interval) => ({
              hour: { $gte: interval.startHour, $lt: interval.endHour }, // Usamos hour que ya está en UTC-3
            })),
          })),
        },
      },] : []),


      {
        $match: {
          sportMode: { $in: preferredSportModes.map((mode: SportMode) => mode._id) }, // Asegúrate de que son ObjectId
        },
      },

      // Poblamos los campos relacionados

      {
        $lookup: {
          from: 'users', // Colección de Users
          localField: 'users', // Campo en Match
          foreignField: '_id', // Campo en Users
          as: 'users', // Nombre de la propiedad a llenar
        },
      },
      // Puedes hacer un unwind si lo necesitas para objetos relacionados
      { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'sportmodes', // Colección de SportsModes
          localField: 'sportMode', // Campo en Match
          foreignField: '_id', // Campo en SportsModes
          as: 'sportMode', // Nombre de la propiedad a llenar
        },
      },

    ]);


    return matches;
  }

  async getUsersForMatchRecommendations(match: MatchDto): Promise<User[]> {
    const day = this.getDay(match.dayOfWeek)
    const hour = match.hour
    const locationId = (match.location) as ObjectId
    const location = await this.locationsService.findOne(locationId)
    const sportModeId = new ObjectId(match.sportMode as ObjectId)
    const sportMode = await this.sportModesService.findById(sportModeId)
    const sportId = sportMode.sport
    const users = await this.userModel.aggregate([
      {
        $match: {
          $or: [
            // Usuarios con preferredSportModes que incluyen sportModeId
            { 'profile.preferredSportModes': sportModeId },
            // Usuarios sin preferredSportModes y con preferredSports que coincidan con sportId
            {
              $and: [
                { 'profile.preferredSportModes': { $exists: true } },
                { 'profile.preferredSportModes': { $size: 0 } },
                { 'profile.preferredSports': sportId },
              ],
            },
          ],
        },
      },
      {
        $lookup: {
          from: "zones",
          localField: "profile.preferredZones",
          foreignField: "_id",
          as: "preferredZones"
        }
      },
      {
        $match: {
          // Validar que alguna zona preferida del usuario contiene la ubicación del Match

          $or: [
            {
              'preferredZones.location': {
                $geoIntersects: {
                  $geometry: location.location,
                }
              }
            },
            {
              'preferredZones': { $size: 0 }
            }
          ]
        },
      },
      {
        $match: {
          // Validar disponibilidad del usuario
          $or: [{
            'profile.availability': {
              $elemMatch: {
                day: day,
                intervals: {
                  $elemMatch: {
                    startHour: { $lte: hour }, // Intervalo incluye la hora del Match
                    endHour: { $gt: hour },
                  },
                },
              },
            }
          },
          {
            $and: [
              { 'profile.preferredSportModes': { $exists: true } },
              { 'profile.availability': { $size: 0 } }
            ]
          }
          ]
        },
      },

    ])
    return users;
  }

  async addUserToFormation(userId: ObjectId, matchId: ObjectId, team: 1 | 2, position: number): Promise<Formations> {
    const match = await this.matchModel.findById(matchId).exec();
    if (!match) {
      throw new Error("Match not found");
    }

    // Preparar nuevas formaciones
    const newFormations: Formations = {
      team1: [],
      team2: [],
    };
    if(!match.formations) match.formations = newFormations

    let userAlreadyIn = false;

    // Helper para procesar los equipos
    const processTeam = (players: Player[], targetTeam: Player[]) => {
      for (const player of players) {
        if (player.userId.toString() === userId.toString()) {
          userAlreadyIn = true;
          player.position = position; // Actualizar posición
          team === 1 ? newFormations.team1.push(player) : newFormations.team2.push(player);
        } else {
          if (player.position !== position) //Si hay alguien en la misma posición y equipo no lo agregamos
            targetTeam.push(player); // Conservar jugadores que no se modifican
        }
      }
    };

    // Procesar ambos equipos
    processTeam(match.formations.team1, newFormations.team1);
    processTeam(match.formations.team2, newFormations.team2);

    // Si no estaba en ninguno de los equipos, agregarlo
    if (!userAlreadyIn) {
      const newPlayer: Player = { position, userId };
      team === 1 ? newFormations.team1.push(newPlayer) : newFormations.team2.push(newPlayer);
    }

    // Actualizar el partido en la base de datos
    match.formations = newFormations;
    await match.save();

    return newFormations;
  }

  async removeUserFromFormation(matchId: ObjectId, userId: ObjectId) {
    const match = await this.matchModel.findById(matchId).exec();
    if (!match) {
      throw new Error("Match not found");
    }
    // Preparar nuevas formaciones
    const newFormations: Formations = {
      team1: [],
      team2: [],
    };
    if(!match.formations) match.formations = newFormations
    const processTeam = (players: Player[], targetTeam: Player[]) => {
      for (const player of players) {
        if (player.userId.toString() !== userId.toString()) {
          targetTeam.push(player)
        }
      }
    }

    // Procesar ambos equipos
    processTeam(match.formations.team1, newFormations.team1);
    processTeam(match.formations.team2, newFormations.team2);

    // Actualizar el partido en la base de datos
    match.formations = newFormations;
    await match.save();

    return newFormations;
  }

  // Convertir día de la semana a índice (igual que antes)
  private getDayIndex(day: string): number {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return days.indexOf(day); // MongoDB usa Domingo como 0, Lunes como 1, etc.
  }

  private getDay(index: number): string {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return days[index]
  }

}  