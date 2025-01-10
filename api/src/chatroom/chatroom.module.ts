import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chatroom, ChatroomSchema } from './entities/chatroom.entity';
import { Match, MatchSchema } from 'match/match.entity';
import { User, UserSchema } from 'user/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chatroom.name, schema: ChatroomSchema },
      { name: Match.name, schema: MatchSchema },
      { name: User.name, schema: UserSchema }
    ])],
  controllers: [ChatroomController],
  providers: [ChatroomService],
})
export class ChatroomModule { }
