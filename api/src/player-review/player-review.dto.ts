import { PartialType } from '@nestjs/swagger';

export class CreatePlayerReviewDto {}
export class UpdatePlayerReviewDto extends PartialType(CreatePlayerReviewDto) {}

