import { PartialType } from '@nestjs/swagger';
import { Match } from 'match/match.entity';
import { Types } from 'mongoose';
import { Question } from 'question/question.entity';
import { User } from 'user/user.entity';
export class CreateQuizDto {
    matchId: Types.ObjectId | Match;
    player1: Types.ObjectId | User;
    player2: Types.ObjectId | User;
    questions: Types.ObjectId[] | Question[]
}


export class UpdateQuizDto extends PartialType(CreateQuizDto) {
    scorePlayer1?: Number;
    scorePlayer2?: Number;
    
 }