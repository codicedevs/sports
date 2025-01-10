import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chatroom, ChatroomSchema } from 'chatroom/entities/chatroom.entity';
import { User, UserSchema } from 'user/user.entity';
import { Message, MessageSchema } from './entities/message.entity';

@Module({
  imports: [
      MongooseModule.forFeature([
        { name: Chatroom.name, schema: ChatroomSchema },
        { name: User.name, schema: UserSchema },
        { name: Message.name, schema: MessageSchema }
      ])],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
