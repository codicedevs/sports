import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException, Req } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { CreateChatroomDto, UpdateChatroomDto } from './chatroom.dto';
import { Filter } from 'types/types';
import { CreateMessageDto, SendMessageDto } from 'messages/message.dto';
import { MessagesService } from 'messages/messages.service';
import { ChatroomKind } from './chatroom.enum';
import { ValidateObjectIdPipe } from 'pipes/validate-object-id.pipe';
import { Types } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';

@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService,
    private readonly messagesService: MessagesService
  ) { }


  @Post(':chatroomId/send')
  send(@Param('chatroomId', new ValidateObjectIdPipe("chatroom")) chatroomId: string,
    @Body() sendMessageDto: SendMessageDto,
    @Req() request: Request) {
    const { sub } = request['user'] as JwtPayload;
    const senderId = new Types.ObjectId(sub);
    if (!Types.ObjectId.isValid(senderId)) {
      throw new BadRequestException(`ID de sender inválido`);
    }
    return this.messagesService.create({ chatroomId, senderId, ...(sendMessageDto) })
  }
  
  @Get()
  findAll(@Query() filter: Filter) {
    return this.chatroomService.findAll(filter);
  }
  @Get('user/:userId')
  getLastMessage(@Param('userId', new ValidateObjectIdPipe("user")) userId: string) {
    return this.chatroomService.getUserChatroomsWithLastMessage(userId, [ChatroomKind.group, ChatroomKind.match])
  }

  @Get(':id')
  findOne(@Param('id', new ValidateObjectIdPipe()) id: string) {
    return this.chatroomService.findOne(id);
  }

}
