
import { Module } from '@nestjs/common';
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
import { APP_FILTER } from '@nestjs/core';
import { MessagesModule } from './messages/messages.module';
import { ChatroomModule } from './chatroom/chatroom.module';

import { GroupsModule } from './groups/groups.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FilterPlugin } from 'filter/filter.plugin';
import { MatchViewModule } from 'match/match-view.module';
import { ActivityModule } from './activity/activity.module';
@Module({
    imports: [
        MongooseModule.forRoot('mongodb+srv://admin:k1k1r1ki@codice.9kqgu.mongodb.net/', {
            connectionFactory: (connection) => {
                connection.plugin(FilterPlugin);
                return connection;
            },
        }),
        // MongooseModule.forRoot(`mongodb://${serverSetting.DB_HOST}:${serverSetting.DB_PORT}/${serverSetting.DB_DATABASE}`, {
        //     user: serverSetting.DB_USERNAME,
        //     pass: serverSetting.DB_PASSWORD,
        //     authSource: "admin",
        //     connectionFactory: (connection) => {
        //         // Apply the FilterPlugin globally
        //         connection.plugin(FilterPlugin);
        //         return connection;
        //     }, // Specifies the authentication database
        //     // useNewUrlParser: true,
        //     // useUnifiedTopology: true,
        // }),
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
        GroupsModule,
        MatchViewModule,
        ActivityModule
    ],
    controllers: [AppController],
    providers: [
        AppService
    ],
})

export class AppModule { }