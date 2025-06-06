
import { Module } from '@nestjs/common';
import { SentryModule } from '@sentry/nestjs/setup';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { serverSetting } from 'settings';
import { MatchModule } from 'match/match.module';
import { PetitionModule } from 'petition/petition.module';
import { LocationsModule } from './locations/locations.module';
import { EventModule } from './event/event.module';
import { ZonesModule } from './zones/zones.module';
import { SportsModule } from './sports/sports.module';
import { SportModesModule } from './sport_modes/sport_modes.module';
import { SentryGlobalFilter } from '@sentry/nestjs/setup';
import { APP_FILTER } from '@nestjs/core';
import { MessagesModule } from './messages/messages.module';
import { ChatroomModule } from './chatroom/chatroom.module';

import { GroupsModule } from './groups/groups.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
@Module({
  imports: [
    SentryModule.forRoot(),
    MongooseModule.forRoot(`mongodb://${serverSetting.DB_HOST}:${serverSetting.DB_PORT}/${serverSetting.DB_DATABASE}`, {
      user: serverSetting.DB_USERNAME,
      pass: serverSetting.DB_PASSWORD,
      authSource: "admin", // Specifies the authentication database
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    }),
    EventEmitterModule.forRoot(),
    UserModule,
    AuthenticationModule,
    MatchModule,
    PetitionModule,
    LocationsModule,
    EventModule,
    ZonesModule,
    SportsModule,
    SportModesModule,
    MessagesModule,
    ChatroomModule,
    GroupsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
        provide: APP_FILTER,
        useClass: SentryGlobalFilter
    }
  ],
})

export class AppModule {}