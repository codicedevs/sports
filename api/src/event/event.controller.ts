import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto, UpdateEventDto } from './event.dto';
import { Public } from 'authentication/public';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { ValidateObjectIdPipe } from 'pipes/validate-object-id.pipe';
import { Filter } from 'types/types';

@Public()
@ApiBearerAuth()
@ApiTags('events')
@Controller('events')
export class EventController {
    constructor(private readonly eventService: EventService) { }

    @Post()
    create(@Body() createEventDto: CreateEventDto) {
        return this.eventService.create(createEventDto);
    }

    @Get()
    findAll(@Query() filter: Filter) {
        return this.eventService.findAll(filter);
    }

    @Get(':id')
    findOne(@Param('id', new ValidateObjectIdPipe()) id: Types.ObjectId) {
        return this.eventService.findOne(new Types.ObjectId(id));
    }

    @Patch(':id')
    update(@Param('id', new ValidateObjectIdPipe()) id: Types.ObjectId, @Body() updateEventDto: UpdateEventDto) {
        return this.eventService.update(new Types.ObjectId(id), updateEventDto);
    }

    @Delete(':id')
    remove(@Param('id', new ValidateObjectIdPipe()) id: Types.ObjectId) {
        return this.eventService.remove(new Types.ObjectId(id));
    }
}
