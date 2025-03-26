import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'quiz', cors: { origin: '*' } })
export class QuizGateway {
  @WebSocketServer()
  server: Server;

  // Cuando un cliente quiera unirse a un quiz, se une a una sala específica
  @SubscribeMessage('joinQuiz')
  handleJoinQuiz(client: Socket, quizId: string) {
    client.join(`quiz_${quizId}`);
    return { message: `Joined quiz ${quizId}` };
  }

  // Método para emitir actualizaciones a la sala del quiz
  notifyQuizUpdated(quizId: string, data: any) {
    this.server.to(`quiz_${quizId}`).emit('quizUpdated', data);
  }
}
