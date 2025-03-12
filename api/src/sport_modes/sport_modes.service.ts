import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSportModeDto, UpdateSportModeDto } from './sport_mode.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { SportMode } from './sport_mode.entity';
import { Connection, Model, Types } from 'mongoose';
import { Filter, FilterResponse } from 'types/types';
import { Match } from 'match/match.entity';
import { User } from 'user/user.entity';

@Injectable()
export class SportModesService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(SportMode.name) private readonly sportModeModel: Model<SportMode>,
    @InjectModel(Match.name) private readonly matchModel: Model<Match>,
    @InjectModel(User.name) private readonly userModel: Model<User>) { }
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

  async update(id: Types.ObjectId, updateSportModeDto: UpdateSportModeDto) {
    const sportMode = await this.sportModeModel
      .findByIdAndUpdate(id, updateSportModeDto, {
        new: true,
      })
      .exec();

    if (!sportMode) {
      throw new NotFoundException(`SportMode #${id} not found`);
    }

    return sportMode
  }

  async remove(id: Types.ObjectId) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const result = await this.sportModeModel.findByIdAndDelete(id, { session });
      if (!result) {
        throw new NotFoundException(`SportMode con id ${id} no encontrado`);
      }

      await this.matchModel.updateMany(
        { sportMode: id },
        { $unset: { sportMode: '' } },
        { session },
      );

      await this.userModel.updateMany(
        { 'profile.preferredSportModes': id },
        { $pull: { 'profile.preferredSportModes': id } },
        { session },
      );

      await session.commitTransaction();
      session.endSession();

      return { deleted: true };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

}
