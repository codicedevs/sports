import { Module } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { ZonesController } from './zones.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Zone, ZoneSchema } from './zone.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Zone.name, schema: ZoneSchema }]),
  ],
  controllers: [ZonesController],
  providers: [ZonesService],
  exports: [ZonesService]
})
export class ZonesModule {}
