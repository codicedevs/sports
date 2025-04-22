import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { User, UserSchema } from "./user.entity";
import { JwtModule } from "@nestjs/jwt";
import { jwtSetting } from "settings";
import { Petition, PetitionSchema } from "petition/petition.entity";
import { Match, MatchSchema } from "match/match.entity";
import { PushNotificationService } from "services/pushNotificationservice";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Petition.name, schema: PetitionSchema },
            { name: Match.name, schema: MatchSchema },
        ]),
        JwtModule.register({
            secret: jwtSetting.JWT_ACCESS_SECRET,
            signOptions: { expiresIn: jwtSetting.JWT_ACCESS_EXPIRES },
        }),
    ],
    controllers: [UserController],
    providers: [UserService,PushNotificationService],
    exports: [UserService, MongooseModule],
})
export class UserModule { }
