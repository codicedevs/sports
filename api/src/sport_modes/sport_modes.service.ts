import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSportModeDto } from './dto/create-sport_mode.dto';
import { UpdateSportModeDto } from './dto/update-sport_mode.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SportMode } from './entities/sport_mode.entity';
import { Model, Types } from 'mongoose';
import { FindManyFilter } from 'filter/filter.dto';

@Injectable()
export class SportModesService {
  constructor(@InjectModel(SportMode.name) private readonly sportModeModel: Model<SportMode>) { }
  async create(createSportModeDto: CreateSportModeDto) {
    const createdSportMode = new this.sportModeModel(createSportModeDto)
    return createdSportMode.save()
  }

  async findAll(options?: FindManyFilter<SportMode>): Promise<SportMode[]> {
    const sportsModes = await this.sportModeModel.find(options).exec();
    return sportsModes;
  }

  async findForSports(sportIds: string[]| Types.ObjectId[]): Promise<SportMode[]> {
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
