import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from 'question/question.entity';
import { Quiz, QuizSchema } from './quiz.entity';
import { QuestionModule } from 'question/question.module';
import { QuizGateway } from './quiz.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }]),
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }]),
    QuestionModule
  ],
  controllers: [QuizController],
  providers: [QuizService, QuizGateway],  // Agregá aquí el gateway
})
export class QuizModule {}
