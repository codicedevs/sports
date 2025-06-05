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
import { Group } from "groups/group.entity";


@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Match.name) private readonly matchModel: Model<Match>,
        @InjectModel(Petition.name) private readonly petitionModel: Model<Petition>,
        @InjectModel(Chatroom.name) private readonly chatroomModel: Model<Chatroom>,
        @InjectModel(Group.name) private readonly groupModel: Model<Group>,
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
        const users = await this.userModel.find({ where: { name: regex } }).exec();

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
            .find({ where: { receiver: objectId } })
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
        // ────────────── 1) Borrar usuario (y obtenerlo) ────────────────
        const user = await this.userModel.findById(id).exec();
        if (!user) throw new NotFoundException('Usuario no encontrado');
        await this.userModel.findByIdAndDelete(id).exec();
        // ────────────── 2) Quitarme de la lista de amigos ──────────────
        if (user.friends?.length) {
            await this.userModel.updateMany(
                { _id: { $in: user.friends } },
                { $pull: { friends: id } },
            ).exec();
        }

        // ────────────── 3) Sacarme de groups (todos) ───────────────────
        // 3-A) Pull global
        if (user.groups?.length) {
            await this.groupModel.updateMany(
                { _id: { $in: user.groups } },
                { $pull: { users: id } },
            ).exec();

            // 3-B) Reasignar owner donde era admin
            const owned = await this.groupModel
                .find({
                    where: {
                        _id: { $in: user.groups },
                        userId: id,
                    }
                })
                .select('_id users')   // solo lo necesario
                .lean();
            const ops = owned
                .map(m => {
                    const remaining = (m.users as Types.ObjectId[]).filter(u => !u.equals(id));
                    if (!remaining.length) return null;       // sin owner → puedes borrarlo o dejarlo sin userId
                    return {
                        updateOne: {
                            filter: { _id: m._id },
                            update: { $set: { userId: remaining[0] } }, // 1.er usuario restante
                        },
                    };
                })
                .filter(Boolean);

            if (ops.length) await this.groupModel.bulkWrite(ops);
        }

        // ────────────── 4) Sacarme de matches PASADOS ──────────────────
        if (user.matches?.length) {
            const now = new Date();

            // 4-A) Pull global
            await this.matchModel.updateMany(
                { _id: { $in: user.matches }, date: { $lt: now } },
                { $pull: { users: id } },
            );

            // 4-B) Reasignar owner donde era admin
            const owned = await this.matchModel
                .find({
                    where: {
                        _id: { $in: user.matches },
                        date: { $lt: now },
                        userId: id
                    }
                })
                .select('_id users')   // solo lo necesario
                .lean();

            const ops = owned
                .map(m => {
                    const remaining = (m.users as Types.ObjectId[]).filter(u => !u.equals(id));
                    if (!remaining.length) return null;       // sin owner → puedes borrarlo o dejarlo sin userId
                    return {
                        updateOne: {
                            filter: { _id: m._id },
                            update: { $set: { userId: remaining[0] } }, // 1.er usuario restante
                        },
                    };
                })
                .filter(Boolean);

            if (ops.length) await this.matchModel.bulkWrite(ops);
        }

        // ──────────────  5) Borrar peticiones donde esté como emisor o receptor ────────────────

        await this.petitionModel.deleteMany({ $or: [{ receiver: id }, { emitter: id }] })


        // ────────────── 6) Devuelvo el usuario borrado ────────────────
        return user;
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
        const friend = await this.userModel.findById(friendId).exec();
        if (!user) {
            throw new NotFoundException("Usuario no encontrado");
        }

        // Filter out the friendId from the friends array
        user.friends = user.friends.filter((f) => !f.equals(friendId));
        friend.friends = friend.friends.filter((f) => !f.equals(userId));

        await friend.save();
        return await user.save();
    }

    async getTokenUsersIdsList(userIds: Types.ObjectId[]): Promise<string[]> {
        // Buscamos todos los usuarios cuyos _id estén en el array y que tengan definido un pushToken
        const users = await this.userModel
            .find({
                where: {
                    _id: { $in: userIds },
                    pushToken: { $exists: true, $ne: null }
                }
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
        if (senderId.equals(receiverId)) {
            throw new BadRequestException('Receptor y emisor tienen que ser usuarios distintos')
        }
        let chatroom = await this.chatroomModel.findOne({
            participants: { $all: [senderId, receiverId] } //Contiene ambos IDs
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
