import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Chatroom } from './entities/chatroom.entity';
import { HydratedDocument, Model, Types } from 'mongoose';
import { ChatroomModelType } from './chatroom.enum';
import { Match } from 'match/match.entity';
import { User } from 'user/user.entity';

type ModelHandlers = {
  [key in ChatroomModelType]: {
    model: Model<any>;
    validate: (target: any) => Promise<void>;
  };
};

const plural: Record<ChatroomModelType, string> = {
  Match: "matches",
};
@Injectable()
export class ChatroomService {
  constructor(
    @InjectModel(Chatroom.name) private readonly chatroomModel: Model<Chatroom>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Match.name) private readonly matchModel: Model<Match>,
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
  };

  async create(createChatroomDto: CreateChatroomDto) {
    if (!Types.ObjectId.isValid(createChatroomDto.reference.id)) {
      throw new BadRequestException(`ID inválido`);
    }
    const targetId = new Types.ObjectId(createChatroomDto.reference.id)
    const modelType = createChatroomDto.reference.type
    const handler = this.modelHandlers[modelType];
    if (!handler) {
      throw new BadRequestException("Tipo de referencia no soportado");
    }
    const target = await handler.model.findById(targetId).exec();

    // Validar el modelo objetivo (group o match)
    await handler.validate(target);
    const chatroom =  new this.chatroomModel({
      messages: [], ...createChatroomDto
    })

    return chatroom.save()
  }

  async getLastMessage(chatroomId: Types.ObjectId) {
    if (!Types.ObjectId.isValid(chatroomId)) {
      throw new BadRequestException(`ID de chatroom inválido`);
    }
  
    const chatroom = await this.chatroomModel.findById(chatroomId).populate('messages').exec();
  
    if (!chatroom) {
      throw new NotFoundException("Chatroom no encontrado");
    }
  
    const messages = chatroom.messages;
    if (!messages || messages.length === 0) {
      return null; // No hay mensajes
    }
  
    return messages[messages.length - 1]; // Retorna el último mensaje
  }
  

  async getUserChatroomsWithLastMessage(userId: Types.ObjectId) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('ID de usuario inválido');
    }
  
    const user = await this.userModel.findById(userId).exec(); 
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
  
    const chatroomsWithLastMessages = [];
  
    // Iterar por los tipos de modelo definidos en `plural`
    for (const [modelType, pluralField] of Object.entries(plural)) {
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
  
  
  findAll() {
    return `This action returns all chatroom`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatroom`;
  }

  update(id: number, updateChatroomDto: UpdateChatroomDto) {
    return `This action updates a #${id} chatroom`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatroom`;
  }
}
