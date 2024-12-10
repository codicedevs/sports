import { Injectable } from '@nestjs/common';
import { CreateSportModeDto } from './dto/create-sport_mode.dto';
import { UpdateSportModeDto } from './dto/update-sport_mode.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SportMode } from './entities/sport_mode.entity';
import { Model } from 'mongoose';
import { FindManyFilter } from 'filter/filter.dto';

@Injectable()
export class SportModesService {
  constructor(@InjectModel(SportMode.name) private readonly sportModeModel: Model<SportMode>) { }
  create(createSportModeDto: CreateSportModeDto) {
    const createdSportMode = new this.sportModeModel(createSportModeDto)
    return createdSportMode.save()
  }

  async findAll(options?: FindManyFilter<SportMode>): Promise<SportMode[]> {
    const sportsModes = await this.sportModeModel.find(options).exec();
    return sportsModes;
  }

  findOne(id: number) {
    return `This action returns a #${id} sportMode`;
  }

  update(id: number, updateSportModeDto: UpdateSportModeDto) {
    return `This action updates a #${id} sportMode`;
  }

  remove(id: number) {
    return `This action removes a #${id} sportMode`;
  }
}
