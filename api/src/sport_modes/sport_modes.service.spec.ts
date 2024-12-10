import { Test, TestingModule } from '@nestjs/testing';
import { SportModesService } from './sport_modes.service';

describe('SportModesService', () => {
  let service: SportModesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SportModesService],
    }).compile();

    service = module.get<SportModesService>(SportModesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
