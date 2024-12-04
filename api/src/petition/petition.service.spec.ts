import { Test, TestingModule } from '@nestjs/testing';
import { PetitionService } from './petition.service';

describe('PeticionesService', () => {
  let service: PetitionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PetitionService],
    }).compile();

    service = module.get<PetitionService>(PetitionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
