import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSportModeDto, UpdateSportModeDto } from './sport_mode.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SportMode } from './sport_mode.entity';
import { Model, Types } from 'mongoose';
import { Filter, FilterResponse } from 'types/types';

@Injectable()
export class SportModesService {
  constructor(@InjectModel(SportMode.name) private readonly sportModeModel: Model<SportMode>) { }
  async create(createSportModeDto: CreateSportModeDto) {
    const createdSportMode = new this.sportModeModel(createSportModeDto)
    return createdSportMode.save()
  }

  async findAll(filter: Filter): Promise<FilterResponse<SportMode>> {
    const results = await this.sportModeModel.find(filter).exec();
    return {
      results,
      totalCount: await this.sportModeModel.countDocuments(filter).exec()
    };
  }

  async findForSports(sportIds: string[] | Types.ObjectId[]): Promise<SportMode[]> {
    const filter = sportIds ? { sport: { $in: sportIds } } : {};
    return this.sportModeModel.find(filter).exec();
  }

  async findById(id: Types.ObjectId): Promise<SportMode> {
    const sportMode = await this.sportModeModel.findById(id)
    if (!sportMode) {
      throw new NotFoundException(`Sportmode with ID ${id} not found`);
    }
    return sportMode
  }

  update(id: number, updateSportModeDto: UpdateSportModeDto) {
    return `This action updates a #${id} sportMode`;
  }

  remove(id: number) {
    return `This action removes a #${id} sportMode`;
  }
}
