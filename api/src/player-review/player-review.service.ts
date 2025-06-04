import { Injectable } from '@nestjs/common';
import { CreatePlayerReviewDto, UpdatePlayerReviewDto } from './player-review.dto';

@Injectable()
export class PlayerReviewService {
  create(createPlayerReviewDto: CreatePlayerReviewDto) {
    return 'This action adds a new playerReview';
  }

  findAll() {
    return `This action returns all playerReview`;
  }

  findOne(id: number) {
    return `This action returns a #${id} playerReview`;
  }

  update(id: number, updatePlayerReviewDto: UpdatePlayerReviewDto) {
    return `This action updates a #${id} playerReview`;
  }

  remove(id: number) {
    return `This action removes a #${id} playerReview`;
  }
}
