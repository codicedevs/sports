import { Test, TestingModule } from '@nestjs/testing';
import { PlayerReviewService } from './player-review.service';

describe('PlayerReviewService', () => {
  let service: PlayerReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerReviewService],
    }).compile();

    service = module.get<PlayerReviewService>(PlayerReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
