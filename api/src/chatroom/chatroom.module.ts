import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chatroom, ChatroomSchema } from './chatroom.entity';
import { Match, MatchSchema } from 'match/match.entity';
import { User, UserSchema } from 'user/user.entity';
import { Group, GroupSchema } from 'groups/group.entity';
import { Message, MessageSchema } from 'messages/message.entity';
import { MessagesModule } from 'messages/messages.module';

@Module({
  imports: [
    MessagesModule,
    MongooseModule.forFeature([
      { name: Chatroom.name, schema: ChatroomSchema },
      { name: Match.name, schema: MatchSchema },
      { name: User.name, schema: UserSchema },
      { name: Group.name, schema: GroupSchema },
      { name: Message.name, schema: MessageSchema }
    ])],
  controllers: [ChatroomController],
  providers: [ChatroomService],
  exports: [ChatroomService]
})
export class ChatroomModule { }
