import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LocationsService } from "./locations.service";
import { LocationsController } from "./locations.controller";
import { Location, LocationSchema } from "./location.entity";
import { Match, MatchSchema } from "match/match.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
      { name: Match.name, schema: MatchSchema },
    ]),
  ],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService],
})
export class LocationsModule {}
