import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatroomDto, UpdateChatroomDto } from './chatroom.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Chatroom } from './chatroom.entity';
import { HydratedDocument, Model, Types } from 'mongoose';
import { ChatroomKind } from './chatroom.enum';
import { Match } from 'match/match.entity';
import { User } from 'user/user.entity';
import { Group } from 'groups/group.entity';
import { Filter, FilterResponse } from 'types/types';
import { Message } from 'messages/message.entity';
import { types } from '@babel/core';
import { MessagesService } from 'messages/messages.service';

type MessageWithAuthor = Message & {
  author: 'me' | 'other';
};


type ModelHandlers = {
  [key in ChatroomKind]: {
    model?: Model<any>;        // opcional
    validate: (payload: CreateChatroomDto) => Promise<void>;
  };
};
const plural: Record<ChatroomKind, string> = {
  Match: "matches",
  Group: "groups",
  Direct: "direct"
};
@Injectable()
export class ChatroomService {
  constructor(
    @InjectModel(Chatroom.name) private readonly chatroomModel: Model<Chatroom>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Match.name) private readonly matchModel: Model<Match>,
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    private readonly messagesService: MessagesService
  ) { }

  modelHandlers: ModelHandlers = {
    [ChatroomKind.match]: {
      validate: async (chatroom) => {
        if (!Types.ObjectId.isValid(chatroom.foreignId)) {
          throw new BadRequestException("Id de partido inválido")
        }
        const target = await this.matchModel.findById(chatroom.foreignId).exec();
        if (!target) {
          throw new NotFoundException("PARTIDO no encontrado");
        }
      },
    },
    [ChatroomKind.group]: {
      validate: async (chatroom) => {
        if (!Types.ObjectId.isValid(chatroom.foreignId)) {
          throw new BadRequestException("Id de grupo inválido")
        }
        const target = await this.groupModel.findById(chatroom.foreignId).exec();
        if (!target) {
          throw new NotFoundException("GRUPO no encontrado");
        }
      },
    },
    [ChatroomKind.direct]: {
      validate: async ({ participants }) => {
        if (!participants || participants.length !== 2) {
          throw new BadRequestException("Un chat directo necesita dos participantes");
        }
        console.log(participants)
        if(participants[0].equals(participants[1])){
          throw new BadRequestException("Un chat directo necesita dos participantes distintos")
        }
        const count = await this.userModel.countDocuments({ where:{_id: { $in: participants } }});
        if (count !== 2) throw new NotFoundException("Algún participante no existe");
      },
    },

  };

  async create(createChatroomDto: CreateChatroomDto) {
    const modelKind = createChatroomDto.kind
    const handler = this.modelHandlers[modelKind];

    if (!handler) {
      throw new BadRequestException("Tipo de referencia no soportado");
    }
    if (createChatroomDto.kind !== ChatroomKind.direct && !createChatroomDto.foreignId) {
      throw new BadRequestException("foreignId es obligatorio para Match/Group");
    }
    // Validar el modelo objetivo (group o match)
    await handler.validate(createChatroomDto);
    const chatroom = new this.chatroomModel({
      messages: [], ...createChatroomDto
    })
    // Acá ya está todo bien formado, habría que ver que no haya otro chatroom igual
    if (modelKind === ChatroomKind.direct) {
      const existsChatroom = await this.chatroomModel.exists({
        kind: modelKind,
        participants: { $all: chatroom.participants, $size: 2 },
      })
      if (existsChatroom) {
        throw new BadRequestException("Ya existe chat directo entre esos dos usuarios")
      }
    }
    else {
      const existsChatroom = await this.chatroomModel.exists({
        kind: modelKind,
        foreignId: createChatroomDto.foreignId
      })
      if (existsChatroom) {
        throw new BadRequestException("Ya eexiste chat para este recurso")
      }

    }

    return chatroom.save()
  }
  async getLastMessage(chatroomId: Types.ObjectId): Promise<Message | null> {
    const lastMessage = await this.messageModel
      .findOne({ chatroomId })
      .sort({ createdAt: -1 }) // Ordenar por fecha de creación descendente
      .exec();

    if (!lastMessage) {
      return null; // No hay mensajes en este chatroom
    }

    return lastMessage;
  }


  async getUserChatroomsWithLastMessage(userId: Types.ObjectId, models?: ChatroomKind[]): Promise<
    Array<{
      chatroomId: Types.ObjectId;
      kind: ChatroomKind;
      foreignId?: Types.ObjectId;
      participants?: Types.ObjectId[];
      lastMessage: Message | null;
    }>
  > {
    const user = await this.userModel.findById(new Types.ObjectId(userId)).exec();
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const results: Array<{
      chatroomId: Types.ObjectId;
      kind: ChatroomKind;
      foreignId?: Types.ObjectId;
      participants?: Types.ObjectId[];
      lastMessage: Message | null;
    }> = [];

    // 2) Chats directos
    const directChats = await this.chatroomModel.find({
      where: {
        kind: ChatroomKind.direct,
        participants: { $in: [user._id] },
      }
    }).exec();

    for (const chat of directChats) {
      const lastMessage = await this.getLastMessage(chat._id as Types.ObjectId);
      results.push({
        chatroomId: chat._id as Types.ObjectId,
        kind: ChatroomKind.direct,
        participants: chat.participants,
        lastMessage,
      });
    }

    // 3) Chats de tipo Match / Group
    const toCheck: ChatroomKind[] = models;

    for (const kind of toCheck) {
      // 'plural' mapea e.g. Match → "matches", Group → "groups"
      const userField = plural[kind] as 'matches' | 'groups';
      const refIds = (user as any)[userField] as Types.ObjectId[] | undefined;
      if (!Array.isArray(refIds)) continue;

      for (const referenceId of refIds) {
        const chat = await this.chatroomModel
          .findOne({ kind, foreignId: referenceId })
          .exec();
        if (!chat) continue;

        const lastMessage = await this.getLastMessage(chat._id as Types.ObjectId);
        results.push({
          chatroomId: chat._id as Types.ObjectId,
          kind: kind,
          foreignId: referenceId,
          lastMessage,
        });
      }
    }
    return results;
  }


  async findAll(filter: Filter): Promise<FilterResponse<Chatroom>> {
    const results = await this.chatroomModel.find(filter).exec();
    return {
      results,
      totalCount: await this.chatroomModel.countDocuments(filter).exec()
    }
  }

  async findOne(id: string) {
    const chatroom = await this.chatroomModel.findById(new Types.ObjectId(id)).populate('messages').exec();

    if (!chatroom) {
      throw new NotFoundException(`Chatroom ${id} no encontrado`);
    }

    return chatroom;
  }

  async getDirectMessages(userId: Types.ObjectId, otherId: Types.ObjectId, filter: Filter){
    const userExists = this.userModel.findById(userId)
    const otherExists = this.userModel.findById(otherId)
    if(!userExists || ! otherExists){
      throw new NotFoundException("Usuario no existe")
    }

    let chatroom = await this.chatroomModel.findOne({
            participants: {$all: [userId, otherId]} //Contiene ambos IDs
        }).exec()
    if(!chatroom){
      chatroom = await this.create({
        kind: ChatroomKind.direct,
        participants: [userId, otherId]
      })
    }
    const chatroomId = chatroom._id as Types.ObjectId
    let newMessages: MessageWithAuthor[] = []
    if (!filter.where){
        filter.where = {}
      }
      filter.where= {...filter.where, ...{chatroomId: chatroomId}}
      const messages =  await this.messagesService.findAll(filter);
      const messageResults = messages.results 
      messageResults.forEach((message: Message) =>{
        newMessages.push({
          ...message.toObject(),
          author: (message.senderId as Types.ObjectId).equals(userId) ? "me" : "other"
        })
      })

    return {
      ...messages,
      results: newMessages
    }
  
  }

  update(id: number, updateChatroomDto: UpdateChatroomDto) {
    return `This action updates a #${id} chatroom`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatroom`;
  }
}
