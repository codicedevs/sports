import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchViewService } from './match-view.service';
import { MatchView, MatchViewSchema } from './match-view.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MatchView.name, schema: MatchViewSchema }]),
  ],
  providers: [MatchViewService],
  exports: [MatchViewService], // Si quieres exportarlo para usarlo en otros módulos
})
export class MatchViewModule {}
