import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { Filter } from 'types/types';
import { CreateMessageDto, SendMessageDto } from 'messages/dto/create-message.dto';
import { MessagesService } from 'messages/messages.service';
import { ChatroomModelType } from './chatroom.enum';

@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService,
    private readonly messagesService: MessagesService
  ) { }


  @Post(':chatroomId/send')
  send(@Param('chatroomId') chatroomId: string,
    @Body() sendMessageDto: SendMessageDto) {
    return this.messagesService.create({ chatroomId, ...(sendMessageDto) })
  }

  @Get()
  findAll(@Query() filter: Filter) {
    return this.chatroomService.findAll(filter);
  }
  @Get('user/:userId')
  getLastMessage(@Param('userId') userId: string) {
    return this.chatroomService.getUserChatroomsWithLastMessage(userId, [ChatroomModelType.group])
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatroomService.findOne(id);
  }

}
