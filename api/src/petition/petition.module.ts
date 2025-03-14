import { Module } from "@nestjs/common";
import { PetitionController } from "./petition.controller";
import { PetitionService } from "./petition.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "user/user.entity";
import { Match, MatchSchema } from "match/match.entity";
import { Petition, PetitionSchema } from "./petition.entity";
import { PushNotificationService } from "services/pushNotificationservice";
import { Group, GroupSchema } from "groups/group.entity";
import { MatchService } from "match/match.service";
import { GroupsService } from "groups/groups.service";
import { ChatroomService } from "chatroom/chatroom.service";
import { Chatroom, ChatroomSchema } from "chatroom/chatroom.entity";
import { Message, MessageSchema } from "messages/message.entity";
import { Activity, ActivitySchema } from "activity/activity.entity";
import { ActivityService } from "activity/activity.service";
import { ActivityModule } from "activity/activity.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Petition.name, schema: PetitionSchema },
      { name: Match.name, schema: MatchSchema },
      { name: User.name, schema: UserSchema },
      { name: Group.name, schema: GroupSchema },
      { name: Chatroom.name, schema: ChatroomSchema },
      { name: Message.name, schema: MessageSchema }
    ]),
    ActivityModule
  ],
  controllers: [PetitionController],
  providers: [PetitionService, PushNotificationService, GroupsService, ChatroomService],
  exports: [PetitionService]
})
export class PetitionModule { }
