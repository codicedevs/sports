import { Test, TestingModule } from '@nestjs/testing';
import { SportModesController } from './sport_modes.controller';
import { SportModesService } from './sport_modes.service';

describe('SportModesController', () => {
  let controller: SportModesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SportModesController],
      providers: [SportModesService],
    }).compile();

    controller = module.get<SportModesController>(SportModesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
