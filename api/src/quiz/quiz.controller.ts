import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto, UpdateQuizDto } from './quiz.dto';
import { Types } from 'mongoose';
import { ValidateObjectIdPipe } from 'pipes/validate-object-id.pipe';
import { Filter } from 'types/types';
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.create(createQuizDto);
  }

  @Get()
  findAll(@Query() filter: Filter) {
    return this.quizService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id', new ValidateObjectIdPipe()) id: string) {
    return this.quizService.findOne(new Types.ObjectId(id));
  }

  @Patch(':id')
  update(@Param('id', new ValidateObjectIdPipe()) id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizService.update(new Types.ObjectId(id), updateQuizDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizService.remove(+id);
  }
}
