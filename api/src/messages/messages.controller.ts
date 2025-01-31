import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto, UpdateMessageDto } from './message.dto';
import { Filter } from 'types/types';
import { ValidateObjectIdPipe } from 'pipes/validate-object-id.pipe';
import { Types } from 'mongoose';


@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    if (!Types.ObjectId.isValid(createMessageDto.chatroomId)) {
      throw new BadRequestException(`ID de chatroom inválido`);
    }
    if (!Types.ObjectId.isValid(createMessageDto.senderId)) {
      throw new BadRequestException(`ID de sender inválido`);
    }
    return this.messagesService.create(createMessageDto);
  }

  @Get()
  findAll(@Query() filter: Filter) {
    return this.messagesService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id', new ValidateObjectIdPipe()) id: string) {
    return this.messagesService.findById(id);
  }

  @Patch(':id')
  update(@Param('id', new ValidateObjectIdPipe()) id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(+id);
  }
}
