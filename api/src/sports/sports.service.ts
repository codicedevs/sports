import { Injectable } from '@nestjs/common';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Sport } from './entities/sport.entity';
import { Model } from 'mongoose';
import { FindManyFilter } from 'filter/filter.dto';

@Injectable()
export class SportsService {
  constructor(@InjectModel(Sport.name) private readonly sportModel: Model<Sport>) { }
  async create(createSportDto: CreateSportDto) {
    const createdSport = new this.sportModel(createSportDto)
    return createdSport.save()
  }

  async findAll(options?: FindManyFilter<Sport>): Promise<Sport[]> {
    const sports = await this.sportModel.find(options).exec();
    return sports;
  }

  findOne(id: number) {
    return `This action returns a #${id} sport`;
  }

  update(id: number, updateSportDto: UpdateSportDto) {
    return `This action updates a #${id} sport`;
  }

  remove(id: number) {
    return `This action removes a #${id} sport`;
  }
}
