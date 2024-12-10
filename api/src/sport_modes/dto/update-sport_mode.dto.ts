import { PartialType } from '@nestjs/swagger';
import { CreateSportModeDto } from './create-sport_mode.dto';

export class UpdateSportModeDto extends PartialType(CreateSportModeDto) {}
