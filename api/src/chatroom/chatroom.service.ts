import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatroomDto, UpdateChatroomDto } from './chatroom.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Chatroom } from './chatroom.entity';
import { HydratedDocument, Model, Types } from 'mongoose';
import { ChatroomModelType } from './chatroom.enum';
import { Match } from 'match/match.entity';
import { User } from 'user/user.entity';
import { Group } from 'groups/group.entity';
import { Filter } from 'types/types';
import { Message } from 'messages/message.entity';

type ModelHandlers = {
  [key in ChatroomModelType]: {
    model: Model<any>;
    validate: (target: any) => Promise<void>;
  };
};

const plural: Record<ChatroomModelType, string> = {
  Match: "matches",
  Group: "groups"
};
@Injectable()
export class ChatroomService {
  constructor(
    @InjectModel(Chatroom.name) private readonly chatroomModel: Model<Chatroom>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Match.name) private readonly matchModel: Model<Match>,
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) { }
  modelHandlers: ModelHandlers = {
    [ChatroomModelType.match]: {
      model: this.matchModel,
      validate: async (target) => {
        if (!target) {
          throw new NotFoundException("PARTIDO no encontrado");
        }
      },
    },
    [ChatroomModelType.group]: {
      model: this.groupModel,
      validate: async (target) => {
        if (!target) {
          throw new NotFoundException("GRUPO no encontrado");
        }
      },
    },
  };

  async create(createChatroomDto: CreateChatroomDto) {
    const targetId = new Types.ObjectId(createChatroomDto.reference.id)
    const modelType = createChatroomDto.reference.type
    const handler = this.modelHandlers[modelType];
    if (!handler) {
      throw new BadRequestException("Tipo de referencia no soportado");
    }
    const target = await handler.model.findById(targetId).exec();

    // Validar el modelo objetivo (group o match)
    await handler.validate(target);
    const chatroom = new this.chatroomModel({
      messages: [], ...createChatroomDto
    })

    return chatroom.save()
  }
  async getLastMessage(chatroomId: Types.ObjectId) {
    const lastMessage = await this.messageModel
      .findOne({ chatroomId })
      .sort({ createdAt: -1 }) // Ordenar por fecha de creación descendente
      .exec();

    if (!lastMessage) {
      return null; // No hay mensajes en este chatroom
    }

    return lastMessage;
  }


  async getUserChatroomsWithLastMessage(userId: string, models?: ChatroomModelType[]) {
    const user = await this.userModel.findById(new Types.ObjectId(userId)).exec();
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const chatroomsWithLastMessages = [];

    // Iterar por los tipos de modelo definidos en `plural`
    let modelPairs = []
    if (!models) {
      modelPairs = Object.entries(plural)
    }
    else {
      for (let model of models) {
        modelPairs.push(model, plural[model])
      }
    }
    for (const [modelType, pluralField] of modelPairs) {
      if (!user[pluralField] || !Array.isArray(user[pluralField])) {
        continue; // Si no hay datos en este tipo, omitir
      }

      // Buscar chatrooms relacionados con las referencias del usuario
      for (const referenceId of user[pluralField]) {
        const chatroom = await this.chatroomModel
          .findOne({
            'reference.id': referenceId,
            'reference.type': modelType,
          })
          .populate({
            path: 'messages',
            options: { sort: { createdAt: -1 }, limit: 1 },
          })
          .exec();

        if (chatroom) {
          const lastMessage = chatroom.messages[0] || null;
          chatroomsWithLastMessages.push({
            chatroomId: chatroom._id,
            type: modelType,
            referenceId,
            lastMessage,
          });
        }
      }
    }

    return chatroomsWithLastMessages;
  }


  async findAll(filter: Filter) {
    return this.chatroomModel.find(filter);
  }

  async findOne(id: string) {
    const chatroom = await this.chatroomModel.findById(new Types.ObjectId(id)).populate('messages').exec();

    if (!chatroom) {
      throw new NotFoundException(`Chatroom ${id} no encontrado`);
    }

    return chatroom;
  }

  update(id: number, updateChatroomDto: UpdateChatroomDto) {
    return `This action updates a #${id} chatroom`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatroom`;
  }
}
