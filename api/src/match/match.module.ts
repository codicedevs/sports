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

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Match.name, schema: MatchSchema },
            { name: User.name, schema: UserSchema },
            { name: Location.name, schema: LocationSchema },
        ]),
        PetitionModule,
        LocationsModule,
        SportModesModule,
    ],
    controllers: [MatchController],
    providers: [MatchService, JwtService, PushNotificationService],
    exports: [MatchService],
})
export class MatchModule { }
