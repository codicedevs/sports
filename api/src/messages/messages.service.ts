import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { HydratedDocument, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Chatroom } from 'chatroom/entities/chatroom.entity';
import { User } from 'user/user.entity';
import { Message } from './entities/message.entity';
import { Filter, FilterResponse } from 'types/types';
import { ChatroomModelType } from 'chatroom/chatroom.enum';

const translate: Record<ChatroomModelType, string> = {
  Match: "partido",
  Group: "grupo"
};

const plural: Record<ChatroomModelType, string> = {
  Match: "matches",
  Group: "groups"
};

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Chatroom.name) private readonly chatroomModel: Model<Chatroom>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) { }
  async create(createMessageDto: CreateMessageDto) {

    const senderExists = await this.userModel.findById(new Types.ObjectId(createMessageDto.senderId)).exec()
    if (!senderExists) {
      throw new NotFoundException("Usuario no encontrado");
    }
    const chatroomExists = await this.chatroomModel.findById(new Types.ObjectId(createMessageDto.chatroomId)).exec()
    if (!chatroomExists) {
      throw new NotFoundException("Chatroom no encontrado");
    }

    if (!senderExists[plural[chatroomExists.reference.type]].includes(chatroomExists.reference.id)) {
      throw new UnauthorizedException(`El usuario no pertenece a este ${translate[chatroomExists.reference.type]}`)
    }

    const message: HydratedDocument<Message> = new this.messageModel({ senderId: senderExists._id, chatroomId: chatroomExists._id, ...createMessageDto })
    chatroomExists.messages.push(message._id as Types.ObjectId)
    await chatroomExists.save();
    return message.save()

  }

  async findAll(filter: Filter): Promise<FilterResponse<HydratedDocument<Message>>> {
    // Construye la consulta con paginación
    const results = await this.messageModel.find(filter).exec()
    const totalCount = await this.messageModel.countDocuments(filter.where || {});


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
