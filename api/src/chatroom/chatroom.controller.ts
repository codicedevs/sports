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
  @Get('user')
  getLastMessage(
    @Req() request: Request
  ) {
    const { sub } = request['user'] as JwtPayload;
    const userId = new Types.ObjectId(sub);
    return this.chatroomService.getUserChatroomsWithLastMessage(userId, [ChatroomKind.group, ChatroomKind.match])
  }
  @Get('user/direct')
  getLastMessageDirect(
    @Req() request: Request
  ) {
    const { sub } = request['user'] as JwtPayload;
    const userId = new Types.ObjectId(sub);
    return this.chatroomService.getUserChatroomsWithLastMessage(userId, [])
  }

  @Get(':id')
  findOne(@Param('id', new ValidateObjectIdPipe()) id: string) {
    return this.chatroomService.findOne(id);
  }

  @Get(':id/messages')
  async getMessages(@Param('id', new ValidateObjectIdPipe()) id: string,
    @Query() filter: Filter) {
      if (!filter.where){
        filter.where = {}
      }
      filter.where= {...filter.where, ...{chatroomId: id}}
      return await this.messagesService.findAll(filter)
  }

  @Get('user/direct/:otherId')
  async getDirectMessages(@Param('otherId', new ValidateObjectIdPipe("Usuario")) otherId: string,
  @Query() filter: Filter, @Req() request: Request){
    const { sub } = request['user'] as JwtPayload;
    const userId = new Types.ObjectId(sub);
    return await this.chatroomService.getDirectMessages(userId,new Types.ObjectId(otherId), filter)
  }


}
