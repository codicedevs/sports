import { Module } from '@nestjs/common';
import { SportsService } from './sports.service';
import { SportsController } from './sports.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sport, SportSchema } from './entities/sport.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sport.name, schema: SportSchema }]),
  ],
  controllers: [SportsController],
  providers: [SportsService],
  exports: [SportsService]
})
export class SportsModule {}
