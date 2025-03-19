import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "user/user.entity";
import { Match, MatchSchema } from "./match.entity";
import { Location, LocationSchema } from "locations/location.entity";
import { MatchController } from "./match.controller";
import { PetitionModule } from "petition/petition.module";
import { LocationsModule } from "locations/locations.module";
import { MatchService } from "./match.service";
import { JwtService } from "@nestjs/jwt";
import { SportModesModule } from "sport_modes/sport_modes.module";
import { PushNotificationService } from "services/pushNotificationservice";
import { ChatroomModule } from "chatroom/chatroom.module";
import { MatchListener } from "app-listeners/match.listener";
import { MatchViewModule } from "./match-view.module";
import { MatchView, MatchViewSchema } from "./match-view.model";
import { ZonesModule } from "zones/zones.module";
import { SportMode, SportModeSchema } from "sport_modes/sport_mode.entity";
import { serverSetting } from "settings";
import { ActivityModule } from "activity/activity.module";
import { UserModule } from "user/user.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Match.name, schema: MatchSchema },
            { name: User.name, schema: UserSchema },
            { name: Location.name, schema: LocationSchema },
            { name: MatchView.name, schema: MatchViewSchema },
            { name: SportMode.name, schema: SportModeSchema }
        ]),
        //MongooseModule.forRoot(`mongodb://${serverSetting.DB_HOST}:${serverSetting.DB_PORT}/${serverSetting.DB_DATABASE}`),
        PetitionModule,
        LocationsModule,
        SportModesModule,
        ChatroomModule,
        ZonesModule,
        ActivityModule,
        UserModule
    ],
    controllers: [MatchController],
    providers: [MatchService, JwtService, PushNotificationService, MatchListener],
    exports: [MatchService],
})
export class MatchModule { }
