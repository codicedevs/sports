import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Public } from 'authentication/public';
import { ObjectId } from "mongodb";

@Public()
@Controller('events')
export class EventController {
    constructor(private readonly eventService: EventService) { }

    @Post()
    create(@Body() createEventDto: CreateEventDto) {
        return this.eventService.create(createEventDto);
    }

    @Get()
    findAll() {
        return this.eventService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: ObjectId) {
        if (!ObjectId.isValid(id)) throw new BadRequestException("ID de evento inválido");

        return this.eventService.findOne(new ObjectId(id));
    }

    @Patch(':id')
    update(@Param('id') id: ObjectId, @Body() updateEventDto: UpdateEventDto) {
        if (!ObjectId.isValid(id)) throw new BadRequestException("ID de evento inválido");

        return this.eventService.update(new ObjectId(id), updateEventDto);
    }

    @Delete(':id')
    remove(@Param('id') id: ObjectId) {
        if (!ObjectId.isValid(id)) throw new BadRequestException("ID de evento inválido");

        return this.eventService.remove(new ObjectId(id));
    }
}
