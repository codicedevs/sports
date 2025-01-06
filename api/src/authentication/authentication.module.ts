import { Module } from "@nestjs/common";
import { AuthController } from "./authentication.controller";
import { AuthService } from "./authentication.service";
import { JwtModule } from "@nestjs/jwt";
import { AuthGuard } from "./auth.guard";
import { EmailService } from "email/email.service";
import { jwtSetting } from "settings";
import { UserModule } from "user/user.module";
import { GoogleAuthService } from "./google-auth-service";
import { BlacklistService } from "./blackList.service";
import { UserService } from "user/user.service";
@Module({
  imports: [
    JwtModule.register({
      secret: jwtSetting.JWT_ACCESS_SECRET, // secret key para JWT
      signOptions: { expiresIn: jwtSetting.JWT_ACCESS_EXPIRES }, // Configurar según tus necesidades, es el tiempo de expiracion
    }),
    UserModule, // importo modulo de usuarios porque lo consumimos en el servicio de auth(sign In)
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthGuard,
    EmailService,
    GoogleAuthService,
    BlacklistService,
    UserService
  ],
  exports: [AuthService],
})
export class AuthenticationModule {}
