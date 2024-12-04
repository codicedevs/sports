import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./user/user.module";
import { AuthenticationModule } from "./authentication/authentication.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { serverSetting } from "settings";
import { MatchModule } from "match/match.module";
import { PetitionModule } from "petition/petition.module";
import { LocationsModule } from "./locations/locations.module";
import { EventModule } from "./event/event.module";
import { CountInterceptor } from "interceptors/count.interceptors";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${serverSetting.DB_HOST}:${serverSetting.DB_PORT}/${serverSetting.DB_DATABASE}`,
      {
        user: serverSetting.DB_USERNAME,
        pass: serverSetting.DB_PASSWORD,
        authSource: "admin", // Specifies the authentication database
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      },
    ),
    UserModule,
    AuthenticationModule,
    MatchModule,
    PetitionModule,
    LocationsModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService, CountInterceptor],
  exports: [CountInterceptor],
})
export class AppModule {}
