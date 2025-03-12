import { Module } from '@nestjs/common';
import { SportModesService } from './sport_modes.service';
import { SportModesController } from './sport_modes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SportMode, SportModeSchema } from './sport_mode.entity';
import { serverSetting } from 'settings';
import { Match, MatchSchema } from 'match/match.entity';
import { User, UserSchema } from 'user/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SportMode.name, schema: SportModeSchema }]),
    MongooseModule.forFeature([{ name: Match.name, schema:MatchSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
],

  controllers: [SportModesController],
  providers: [SportModesService],
  exports: [SportModesService]
})
export class SportModesModule { }
