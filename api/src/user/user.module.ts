import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { User, UserSchema } from "./user.entity";
import { JwtModule } from "@nestjs/jwt";
import { jwtSetting } from "settings";
import { Petition, PetitionSchema } from "petition/petition.entity";
import { Match, MatchSchema } from "match/match.entity";
import { PetitionModule } from "petition/petition.module";
import { MessagesModule } from "messages/messages.module";
import { ChatroomModule } from "chatroom/chatroom.module";
import { Chatroom, ChatroomSchema } from "chatroom/chatroom.entity";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Petition.name, schema: PetitionSchema },
            { name: Match.name, schema: MatchSchema },
            { name: Chatroom.name, schema: ChatroomSchema },
        ]),
        JwtModule.register({
            secret: jwtSetting.JWT_ACCESS_SECRET,
            signOptions: { expiresIn: jwtSetting.JWT_ACCESS_EXPIRES },
        }),
        forwardRef(() => PetitionModule),
        forwardRef(() => MessagesModule),
        forwardRef(() => ChatroomModule)
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService, MongooseModule],
})
export class UserModule { }
