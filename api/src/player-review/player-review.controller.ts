import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlayerReviewService } from './player-review.service';
import { CreatePlayerReviewDto, UpdatePlayerReviewDto } from './player-review.dto';

@Controller('player-review')
export class PlayerReviewController {
  constructor(private readonly playerReviewService: PlayerReviewService) {}

  @Post()
  create(@Body() createPlayerReviewDto: CreatePlayerReviewDto) {
    return this.playerReviewService.create(createPlayerReviewDto);
  }

  @Get()
  findAll() {
    return this.playerReviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playerReviewService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlayerReviewDto: UpdatePlayerReviewDto) {
    return this.playerReviewService.update(+id, updatePlayerReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playerReviewService.remove(+id);
  }
}
