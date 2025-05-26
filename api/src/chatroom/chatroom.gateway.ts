import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'

@WebSocketGateway({ namespace: 'chatroom', cors: { origin: '*' } })
export class ChatroomGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  handleConnection(client: Socket) {
    //console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    //console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string
  ) {
    client.join(room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string
  ) {
    client.leave(room);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { room: string; message: string }
  ) {
    // Emite a todos los clientes en esa sala
    this.server.to(payload.room).emit('newMessage', {
      sender: client.id,
      text: payload.message,
      timestamp: Date.now(),
    });
  }
}
