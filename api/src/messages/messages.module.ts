import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chatroom, ChatroomSchema } from 'chatroom/chatroom.entity';
import { User, UserSchema } from 'user/user.entity';
import { Message, MessageSchema } from './message.entity';
import { Petition, PetitionSchema } from 'petition/petition.entity';

@Module({
  imports: [
      MongooseModule.forFeature([
        { name: Chatroom.name, schema: ChatroomSchema },
        { name: User.name, schema: UserSchema },
        { name: Message.name, schema: MessageSchema },
        { name: Petition.name, schema: PetitionSchema }
      ])],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService]
})
export class MessagesModule {}
