import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto, UpdateQuestionDto } from './question.dto';
import { Model, Types } from 'mongoose';
import { Question } from './question.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Filter, FilterResponse } from 'types/types';

@Injectable()
export class QuestionService {
  constructor(@InjectModel(Question.name) private readonly questionModel: Model<Question>, ) { }
 
  async create(createQuestionDto: CreateQuestionDto) {
    const createdQuestion = new this.questionModel(createQuestionDto)
    return createdQuestion.save()
  }

  async findAll(filter: Filter): Promise<FilterResponse<Question>> {
    const results = await this.questionModel.find(filter).exec();
    return {
      results,
      totalCount: await this.questionModel.countDocuments(filter).exec() 
    }
  }

  async findOne(id: Types.ObjectId): Promise<Question> {
    const question = await this.questionModel.findById(id).exec()
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question
  }

  async findNRandom(n: number, excludedIds: Types.ObjectId[] = []): Promise<Question[]> {
    const pipeline: any[] = [];
    
    // Si se pasan ids a excluir, agregamos un $match para filtrarlos
    if (excludedIds.length > 0) {
      pipeline.push({
        $match: { _id: { $nin: excludedIds } }
      });
    }
    
    // Luego usamos $sample para tomar n documentos al azar
    pipeline.push({
      $sample: { size: n }
    });
  
    const randomQuestions = await this.questionModel.aggregate(pipeline);
    if (!randomQuestions || randomQuestions.length === 0) {
      throw new NotFoundException('No se encontraron preguntas');
    }
    return randomQuestions as Question[];
  }
  
  async update(id: Types.ObjectId, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.questionModel.findByIdAndUpdate(id, updateQuestionDto, { new: true }).exec()

    if (!question) {
      throw new NotFoundException(`Question #${id} not found`);
    }
    return question
  }

  remove(id: Types.ObjectId) {
    return `This action removes a #${id} question`;
  }
}
