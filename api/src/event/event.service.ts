import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class EventService {
    constructor(
        @InjectModel(Event.name)
        private readonly eventModel: Model<Event>,
    ) { }
    async create(createEventDto: CreateEventDto): Promise<Event> {
        return await this.eventModel.create(createEventDto)
    }

    async findAll(): Promise<Event[]> {
        return await this.eventModel.find()
    }

    async findOne(id: Types.ObjectId): Promise<Event> {
        const event = await this.eventModel.findById(id).populate('matches').exec();

        if (!event) {
            throw new NotFoundException(`Evento ${id} no encontrado`);
        }

        return event;
    }

    async update(id: Types.ObjectId, updateEventDto: UpdateEventDto) {
        const event = await this.eventModel.findByIdAndUpdate(id, updateEventDto, { new: true }).exec();

        if (!event) {
            throw new NotFoundException(`Evento ${id} no encontrado`);
        }

        return event;
    }

    async remove(id: Types.ObjectId): Promise<Event> {
        const event = this.eventModel.findByIdAndDelete(id).exec();

        if (!event) {
            throw new NotFoundException(`Evento ${id} no encontrado`);
        }

        return event;
    }
}
