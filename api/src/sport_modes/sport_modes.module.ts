import { Module } from '@nestjs/common';
import { SportModesService } from './sport_modes.service';
import { SportModesController } from './sport_modes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SportMode, SportModeSchema } from './entities/sport_mode.entity';

@Module({
  imports:[MongooseModule.forFeature([{ name: SportMode.name, schema: SportModeSchema }]),],
  controllers: [SportModesController],
  providers: [SportModesService],
  exports: [SportModesService]
})
export class SportModesModule {}
