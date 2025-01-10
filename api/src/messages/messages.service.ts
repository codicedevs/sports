import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { HydratedDocument, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Chatroom } from 'chatroom/entities/chatroom.entity';
import { User } from 'user/user.entity';
import { Message } from './entities/message.entity';
import { Filter, FilterResponse } from 'types/types';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Chatroom.name) private readonly chatroomModel: Model<Chatroom>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) { }
  async create(createMessageDto: CreateMessageDto) {
    if (!Types.ObjectId.isValid(createMessageDto.chatroomId)) {
      throw new BadRequestException(`ID de chatroom inválido`);
    }
    if (!Types.ObjectId.isValid(createMessageDto.senderId)) {
      throw new BadRequestException(`ID de sender inválido`);
    }
    const senderExists = await this.userModel.findById(new Types.ObjectId(createMessageDto.senderId)).exec()
    if (!senderExists) {
      throw new NotFoundException("Usuario no encontrado");
    }
    const chatroomExists = await this.chatroomModel.findById(new Types.ObjectId(createMessageDto.chatroomId)).exec()
    if (!chatroomExists) {
      throw new NotFoundException("Chatroom no encontrado");
    }
    const message = new this.messageModel({ senderId: senderExists._id, chatroomId: chatroomExists._id, ...createMessageDto })
    return message.save()

  }

  async findAll(filter: Filter): Promise<FilterResponse<HydratedDocument<Message>>> {
    const results = await this.messageModel.find(filter)
    return {
      results,
      total: await this.messageModel.countDocuments(filter)
    }
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`ID de mensaje inválido`);
    }
    return await this.messageModel.findById(new Types.ObjectId(id)).exec();
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`ID de mensaje inválido`);
    }

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
