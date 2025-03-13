import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto, UpdateActivityDto } from './activity.dto';
import { Activity } from './activity.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Filter, FilterResponse } from 'types/types';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name) private readonly activityModel: Model<Activity>) { }

  create(createActivityDto: CreateActivityDto) {
    const createdActivity = new this.activityModel({ ...createActivityDto, date: new Date() })
    return createdActivity.save()
  }

  async findAll(filter: Filter): Promise<FilterResponse<Activity>> {
    const results = await this.activityModel.find(filter).exec();
    return {
      results,
      totalCount: await this.activityModel.countDocuments(filter).exec()
    }
  }

  async findOne(id: Types.ObjectId) {
    const activity = await this.activityModel.findById(id)
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }
    return activity
  }

  async findByMatchId(matchId: Types.ObjectId) {
    return this.activityModel.find({ where: { matchId } }).sort({ date: -1 }).exec()
  }

  async update(id: Types.ObjectId, updateActivityDto: UpdateActivityDto) {
    const activity = await this.activityModel
      .findByIdAndUpdate(id, updateActivityDto, {
        new: true,
      })
      .exec();

    if (!activity) {
      throw new NotFoundException(`Activity #${id} not found`);
    }

    return activity
  }

  async remove(id: Types.ObjectId): Promise<{ message: string }> {
    const activity = this.activityModel.findByIdAndDelete(id).exec();

    if (!activity) {
      throw new NotFoundException(`Activity ${id} not found`);
    }

    return { message: `Activity ${id} deleted successfully` };
  }
}
