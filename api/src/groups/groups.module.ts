import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { PushNotificationService } from 'services/pushNotificationservice';
import { JwtService } from '@nestjs/jwt';
import { PetitionModule } from 'petition/petition.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'user/user.entity';
import { Group, GroupSchema } from './entities/group.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Group.name, schema: GroupSchema },
    ]),
    PetitionModule
  ],
  controllers: [GroupsController],
  providers: [GroupsService, JwtService, PushNotificationService],
  exports: [GroupsService]
})
export class GroupsModule { }
