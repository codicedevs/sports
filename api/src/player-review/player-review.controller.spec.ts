import { Test, TestingModule } from '@nestjs/testing';
import { PlayerReviewController } from './player-review.controller';
import { PlayerReviewService } from './player-review.service';

describe('PlayerReviewController', () => {
  let controller: PlayerReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerReviewController],
      providers: [PlayerReviewService],
    }).compile();

    controller = module.get<PlayerReviewController>(PlayerReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
