import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMessageDto, UpdateMessageDto } from './message.dto';
import { HydratedDocument, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Chatroom } from 'chatroom/chatroom.entity';
import { User } from 'user/user.entity';
import { Message } from './message.entity';
import { Filter, FilterResponse } from 'types/types';
import { ChatroomKind } from 'chatroom/chatroom.enum';
import { MessageKind } from './message.enum';
import { Petition } from 'petition/petition.entity';
import { ChatroomGateway } from 'chatroom/chatroom.gateway';
import { stringify } from 'querystring';
type ModelHandlers = {
  [key in MessageKind]: {
    model?: Model<any>;        // opcional
    validate: (payload: CreateMessageDto) => Promise<void>;
  };
};
const translateChatroom: Record<ChatroomKind, string> = {
  Match: "partido",
  Group: "grupo",
  Direct: "direct"
};

const pluralChatroom: Record<ChatroomKind, string> = {
  Match: "matches",
  Group: "groups",
  Direct: "direct"
};

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Chatroom.name) private readonly chatroomModel: Model<Chatroom>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    @InjectModel(Petition.name) private readonly petitionModel: Model<Petition>,
    private readonly chatroomGateway: ChatroomGateway,
  ) { }
  modelHandlers: ModelHandlers = {
    [MessageKind.petition]: {
      validate: async (message) => {
        if (!Types.ObjectId.isValid(message.foreignId)) {
          throw new BadRequestException("Id de petición inválido")
        }
        const target = await this.petitionModel.findById(message.foreignId).exec();
        if (!target) {
          throw new NotFoundException("Petición no encontrada");
        }
      },
    },
    [MessageKind.text]: {
      validate: async () => {
      },
    },

  };

  async create(createMessageDto: CreateMessageDto) {
    const modelKind = createMessageDto.kind
    const handler = this.modelHandlers[modelKind];

    if (!handler) {
      throw new BadRequestException("Tipo de referencia no soportado");
    }
    if (modelKind !== MessageKind.text && !createMessageDto.foreignId) {
      throw new BadRequestException("foreignId es obligatorio para Petition");
    }
    // Validar el modelo objetivo (group o match)
    await handler.validate(createMessageDto);

    const senderExists = await this.userModel.findById(new Types.ObjectId(createMessageDto.senderId)).exec()
    if (!senderExists) {
      throw new NotFoundException("Usuario no encontrado");
    }
    const chatroomExists = await this.chatroomModel.findById(new Types.ObjectId(createMessageDto.chatroomId)).exec()
    if (!chatroomExists) {
      throw new NotFoundException("Chatroom no encontrado");
    }
    if (chatroomExists.kind === ChatroomKind.direct) {
      if (!chatroomExists.participants.some(id => id.equals(senderExists._id as Types.ObjectId))) {
        throw new UnauthorizedException(`El usuario no pertece a este chat directo`)
      }
    }
    else {
      if (!senderExists[pluralChatroom[chatroomExists.kind]].some(id => (id as Types.ObjectId).equals(chatroomExists.foreignId))) {
        console.log(chatroomExists.foreignId)
        console.log("____________________________________________________________________________________--")
        console.log(senderExists[pluralChatroom[chatroomExists.kind]])
        throw new UnauthorizedException(`El usuario no pertenece a este ${translateChatroom[chatroomExists.kind]}`)
      }
    }

    const message: HydratedDocument<Message> = new this.messageModel({ senderId: senderExists._id, chatroomId: chatroomExists._id, ...createMessageDto })
    chatroomExists.messages.push(message._id as Types.ObjectId)
    this.chatroomGateway.server
      .to(chatroomExists._id.toString())
      .emit('newMessage', message);
    await chatroomExists.save();

    return message.save()

  }

  async findAll(filter: Filter): Promise<FilterResponse<Message>> {
    // Construye la consulta con paginación
    const resultsDesc = await this.messageModel.find(filter).sort({createdAt: -1}).exec()
    const totalCount = await this.messageModel.countDocuments(filter).exec()

    const results = resultsDesc.reverse()

    // Retorna los resultados con metadatos de paginación
    return {
      results,
      totalCount,
      page: filter.page || 1,
      limit: filter.limit || 0,
    };
  }



  async findById(id: string) {
    return await this.messageModel.findById(new Types.ObjectId(id)).exec();
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    const message = await this.messageModel.findById(id).exec();
    if (!message) {
      throw new NotFoundException("Mensaje no encontrado");
    }

    return this.messageModel.findByIdAndUpdate(
      id,
      { $set: updateMessageDto },
      { new: true } // Devuelve el documento actualizado
    ).exec();
  }


  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
