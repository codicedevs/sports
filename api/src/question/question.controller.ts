import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto, UpdateQuestionDto } from './question.dto';
import { ValidateObjectIdPipe } from 'pipes/validate-object-id.pipe';
import { Types } from 'mongoose';
import { Filter } from 'types/types';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto);
  }

  @Get()
  findAll(@Query() filter: Filter) {
    return this.questionService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id', new ValidateObjectIdPipe()) id: string) {
    return this.questionService.findOne(new Types.ObjectId(id));
  }

  @Patch(':id')
  update(@Param('id', new ValidateObjectIdPipe()) id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionService.update(new Types.ObjectId(id), updateQuestionDto);
  }

}
