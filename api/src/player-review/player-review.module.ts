import { Module } from '@nestjs/common';
import { PlayerReviewService } from './player-review.service';
import { PlayerReviewController } from './player-review.controller';

@Module({
  controllers: [PlayerReviewController],
  providers: [PlayerReviewService],
})
export class PlayerReviewModule {}
