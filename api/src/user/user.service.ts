import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { HydratedDocument, Model, Types } from "mongoose";
import { Profile, User } from "./user.entity";
import { CreateUserDto, UpdateUserDto } from "./user.dto";
import * as bcrypt from "bcryptjs";
import { FindManyFilter } from "filter/filter.dto";
import { Petition } from "petition/petition.entity";
import { Match } from "match/match.entity";
import { Filter, FilterResponse } from "types/types";
import { Chatroom } from "chatroom/chatroom.entity";
import { ChatroomService } from "chatroom/chatroom.service";
import { ChatroomKind } from "chatroom/chatroom.enum";
import { MessagesService } from "messages/messages.service";
import { SendMessageDto } from "messages/message.dto";


@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Match.name) private readonly matchModel: Model<Match>,
        @InjectModel(Petition.name) private readonly petitionModel: Model<Petition>,
        @InjectModel(Chatroom.name) private readonly chatroomModel: Model<Chatroom>,
        private readonly chatroomService: ChatroomService,
        private readonly messagesService: MessagesService,
    ) { }

    /**
     * @returns
     */
    async findAll(filter: Filter): Promise<FilterResponse<User>> {
        const results = await this.userModel.find(filter).exec();
        return {
            results,
            totalCount: await this.userModel.countDocuments(filter).exec()
        };
    }

    /**
     * @param email
     * @returns
     */
    async findOneByEmailOrFail(email: string): Promise<User> {
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
            throw new NotFoundException("Usuario no encontrado");
        }
        return user; // Returns the user found by email
    }

    /**
     * @param searchTerm
     * @returns
     */
    async searchUsersbyName(searchTerm: string): Promise<User[]> {
        const regex = new RegExp(searchTerm, "i");
        const users = await this.userModel.find({where:{ name: regex }}).exec();

        return users;
    }

    /**
     * @param id
     * @returns
     */
    async findByIdOrFail(id: Types.ObjectId): Promise<User> {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException("Usuario no encontrado");
        }
        return user;
    }

    //obtener todos los partidos del usuario
    async getMatchesByUser(userId: Types.ObjectId): Promise<Match[]> {
        //buscar al user por ID y hacer populate de los partidos
        const user = await this.userModel
            .findById(userId)
            .populate({
                path: "matches", // Popula los partidos
                model: "Match", // Modelo de los partidos
                populate: {
                    path: "location", // Popula la ubicación dentro de cada partido
                    model: "Location", // Modelo de la location
                },
            })
            .exec();

        if (!user) {
            throw new NotFoundException("Usuario no encontrado");
        }
        return user.matches as Match[];
    }

    // obtener peticiones donde el usuario es el receiver
    async getUserPetitions(userId: string): Promise<Petition[]> {
        const objectId = new Types.ObjectId(userId);
        const petitions = await this.petitionModel
            .find({ receiver: objectId })
            .populate({
                path: "match", // Popula los partidos
                model: "Match", // Modelo de los partidos
                populate: {
                    path: "location", // Popula la ubicación dentro de cada partido
                    model: "Location", // Modelo de la location
                },
            })
            .populate({
                path: "emitter", // Popula el campo emitter
                model: "User",
            })
            .exec();

        if (!petitions || petitions.length === 0) {
            throw new NotFoundException(
                "No se encontraron invitaciones para este usuario",
            );
        }
        return petitions;
    }

    /**
     * @param createUserDto
     */
    async create(createUserDto: CreateUserDto): Promise<HydratedDocument<User>> {
        let hashedPassword: string | undefined = undefined;
        if (createUserDto.password) {
            hashedPassword = await bcrypt.hash(createUserDto.password, 8);
        }
        const user = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        });

        return user.save(); // Saves and returns the new user
    }

    /**
     * @param id
     * @param updateUserDto
     * @returns
     */
    async update(id: Types.ObjectId, updateUserDto: UpdateUserDto): Promise<User> {
        // 1) Buscar el usuario
        const user: User = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        // 2) Separar campos que requieren lógica especial
        const { password, profile, ...restFields } = updateUserDto;

        // 3) Si hay password, hashearla antes de asignar
        if (password) {
            user.password = await bcrypt.hash(password, 8);
        }

        // 4) Fusionar profile (si lo hay) con el subdocumento existente
        if (profile) {
            const currentProfile = user.profile ? (user.profile as HydratedDocument<Profile>).toObject() : {};
            user.profile = { ...currentProfile, ...profile };
        }

        // 5) Hacer "merge" genérico del resto de campos en el usuario
        Object.assign(user, restFields);

        // 6) Guardar el documento
        return user.save();
    }

    async updatePushToken(
        userId: string,
        pushToken: string,
    ): Promise<User | null> {
        const user = await this.userModel
            .findByIdAndUpdate(new Types.ObjectId(userId), { pushToken }, { new: true })
            .exec();

        if (!user) {
            throw new NotFoundException("User not found");
        }

        return user;
    }

    /**
     * @param id
     * @returns
     */
    async delete(id: Types.ObjectId): Promise<User> {
        const user = await this.findByIdOrFail(id); // Ensure user exists
        await this.userModel.findByIdAndDelete(id).exec();
        return user; // Return the deleted user
    }

    async addFriend(userId: Types.ObjectId, friendId: Types.ObjectId): Promise<User> {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new NotFoundException("Usuario no encontrado");
        }

        // No need to fetch the full friend document, just check if it's already in the list
        if (user.friends.includes(friendId)) {
            throw new BadRequestException("Este usuario ya es tu amigo");
        }

        // Add the friendId directly to the friends array
        user.friends.push(friendId);

        return user.save();
    }

    async getUserFriends(userId: Types.ObjectId): Promise<User> {
        const user = await this.userModel
            .findById(userId)
            .populate("friends")
            .exec();
        return user;
    }

    async removeFriend(userId: Types.ObjectId, friendId: Types.ObjectId): Promise<User> {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new NotFoundException("Usuario no encontrado");
        }

        // Filter out the friendId from the friends array
        user.friends = user.friends.filter((f) => !f.equals(friendId));

        return user.save();
    }

    async getTokenUsersIdsList(userIds: Types.ObjectId[]): Promise<string[]> {
        // Buscamos todos los usuarios cuyos _id estén en el array y que tengan definido un pushToken
        const users = await this.userModel
            .find({
                _id: { $in: userIds },
                pushToken: { $exists: true, $ne: null }
            })
            .select('pushToken')
            .exec();

        // Extraemos el pushToken de cada usuario y filtramos los valores falsy (por si acaso)
        const tokens = users.map(user => user.pushToken).filter(token => !!token);

        return tokens;
    }

    async sendDirectMessage(senderId: Types.ObjectId, receiverId: Types.ObjectId, message: SendMessageDto) {
        const senderExists = this.userModel.findById(senderId);
        const receiverExists = this.userModel.findById(receiverId);
        if (!senderExists) {
            throw new NotFoundException(`Emisor con id ${senderId} no encontrado`)
        }
        if (!receiverExists) {
            throw new NotFoundException(`Receptor con id ${receiverId} no encontrado`)
        }
        if(senderId.equals(receiverId)){
            throw new BadRequestException('Receptor y emisor tienen que ser usuarios distintos')
        }
        let chatroom = await this.chatroomModel.findOne({
            participants: {$all: [senderId, receiverId]} //Contiene ambos IDs
        }).exec()
        if (!chatroom) {
            chatroom = await this.chatroomService.create({
                kind: ChatroomKind.direct,
                participants: [senderId, receiverId]
            })
        }
        const completeMessage = await this.messagesService.create({
            chatroomId: chatroom._id as string,
            senderId: senderId,
            ...message
        })

        return completeMessage

    }
}
