import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { CreateChatroomDto, UpdateChatroomDto } from './chatroom.dto';
import { Filter } from 'types/types';
import { CreateMessageDto, SendMessageDto } from 'messages/message.dto';
import { MessagesService } from 'messages/messages.service';
import { ChatroomModelType } from './chatroom.enum';
import { ValidateObjectIdPipe } from 'pipes/validate-object-id.pipe';
import { Types } from 'mongoose';

@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService,
    private readonly messagesService: MessagesService
  ) { }


  @Post(':chatroomId/send')
  send(@Param('chatroomId', new ValidateObjectIdPipe("chatroom")) chatroomId: string,
    @Body() sendMessageDto: SendMessageDto) {
    if (!Types.ObjectId.isValid(sendMessageDto.senderId)) {
          throw new BadRequestException(`ID de sender inválido`);
        }
    return this.messagesService.create({ chatroomId, ...(sendMessageDto) })
  }

  @Get()
  findAll(@Query() filter: Filter) {
    return this.chatroomService.findAll(filter);
  }
  @Get('user/:userId')
  getLastMessage(@Param('userId', new ValidateObjectIdPipe("user")) userId: string) {
    return this.chatroomService.getUserChatroomsWithLastMessage(userId, [ChatroomModelType.group])
  }

  @Get(':id')
  findOne(@Param('id', new ValidateObjectIdPipe()) id: string) {
    return this.chatroomService.findOne(id);
  }

}
