import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuizDto, UpdateQuizDto } from './quiz.dto';
import { HydratedDocument, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Quiz } from './quiz.entity';
import { Question } from 'question/question.entity';
import { Filter, FilterResponse } from 'types/types';
import { QuestionService } from 'question/question.service';
import { getRandomValues } from 'crypto';
import { QuizGateway } from './quiz.gateway';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Quiz.name) private readonly quizModel: Model<Quiz>,
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
    private readonly quizGateway: QuizGateway, // inyección del gateway
    private readonly questionService: QuestionService,

  ) { }



  async create(createQuizDto: CreateQuizDto) {
    const createdQuiz: HydratedDocument<Quiz> = new this.quizModel(createQuizDto)
    const questions = await this.questionService.findNRandom(10);
    createdQuiz.questions = questions;

    return createdQuiz.save()
  }

  async getCurrentQuestionWithOptions(quizId: Types.ObjectId) {
    const quiz = await this.quizModel.findById(quizId).exec()
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found`)
    }
    const questionId = quiz.questions[quiz.currentQuestion]
    const question = await this.questionModel.findById(questionId).exec()
    if (!question) {
      throw new NotFoundException(`Question with ID ${questionId} not found`)
    }
    const options = [...question.options, question.answer];

    // Mezcla aleatoria usando el algoritmo de Fisher-Yates
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    return {
      question: question.question,
      options
    }
  }

  async answerCurrentQuestion(
    player: 1 | 2,
    options: string[],
    answer: 0 | 1 | 2 | 3,
    quizId: Types.ObjectId
  ) {
    const quiz = await this.quizModel.findById(quizId).exec();
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found`);
    }

    if (quiz.winner != 0) {
      throw new ForbiddenException("Quiz already finished")
    }

    const questionId = quiz.questions[quiz.currentQuestion];
    const question = await this.questionModel.findById(questionId).exec();
    if (!question) {
      throw new NotFoundException(`Question with ID ${questionId} not found`);
    }

    const alreadyAnswered =
      (player === 1 && quiz.scorePlayer1History[quiz.currentQuestion] !== -1) ||
      (player === 2 && quiz.scorePlayer2History[quiz.currentQuestion] !== -1);

    if (alreadyAnswered) {
      throw new ForbiddenException('Question already answered');
    }

    const isCorrect = options[answer] === question.answer;

    if (isCorrect) {
      if (player === 1) {
        quiz.scorePlayer1 += 1;
        quiz.scorePlayer1History[quiz.currentQuestion] = 1;
        quiz.markModified('scorePlayer1History');
      } else {
        quiz.scorePlayer2 += 1;
        quiz.scorePlayer2History[quiz.currentQuestion] = 1;
        quiz.markModified('scorePlayer2History');
      }
    } else {
      if (player === 1) {
        quiz.scorePlayer1History[quiz.currentQuestion] = 0;
        quiz.markModified('scorePlayer1History');
      } else {
        quiz.scorePlayer2History[quiz.currentQuestion] = 0;
      }
    }

    if (quiz.scorePlayer1History[quiz.currentQuestion] != -1 && quiz.scorePlayer2History[quiz.currentQuestion] != -1) {
      
      quiz.currentQuestion++
      if (quiz.currentQuestion > 2) {
        if (quiz.scorePlayer1 > quiz.scorePlayer2) {
          quiz.winner = 1
        } else if (quiz.scorePlayer2 > quiz.scorePlayer1) {
          quiz.winner = 2
        }
      }
      if (quiz.currentQuestion >= quiz.questions.length && quiz.winner===0) {
        
        const newQuestions = await this.questionService.findNRandom(10, quiz.questions as Types.ObjectId[]);
        quiz.questions = [...quiz.questions as Types.ObjectId[], ...newQuestions.map(q => q._id as Types.ObjectId)];
        quiz.markModified('questions');
      }
      
    }

    // Guardar los cambios en la base de datos
    await quiz.save();

    return {
      isCorrect,
      currentQuestion: quiz.currentQuestion,
      winner: quiz.winner,
      scorePlayer1: quiz.scorePlayer1,
      scorePlayer2: quiz.scorePlayer2,
      finished: quiz.winner !== 0
    };
    
  }


  async findAll(filter: Filter): Promise<FilterResponse<Quiz>> {
    const results = await this.quizModel.find(filter).exec()
    return {
      results,
      totalCount: await this.quizModel.countDocuments(filter).exec()
    }
  }

  async findOne(id: Types.ObjectId): Promise<Quiz> {
    const quiz = await this.quizModel.findById(id).exec()
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    return quiz
  }



  async update(id: Types.ObjectId, updateQuizDto: UpdateQuizDto) {
    const quiz = await this.quizModel.findByIdAndUpdate(id, updateQuizDto, { new: true }).exec()

    if (!quiz) {
      throw new NotFoundException(`Quiz #${id} not found`);
    }
    return quiz
  }

  remove(id: number) {
    return `This action removes a #${id} quiz`;
  }
}
