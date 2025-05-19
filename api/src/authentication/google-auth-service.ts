import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { User } from "user/user.entity";
import { SsoAuthInfoDto } from "./singin.dto";
import { UserService } from "user/user.service";
import { Repository } from "typeorm";
import { jwtSetting } from "settings";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client;

  constructor(
    private userService: UserService,
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Asegúrate de tener el Google Client ID en las variables de entorno
  }

  // Método para verificar el token de Google y obtener los datos del usuario
  async verifyGoogleToken(token: string): Promise<any> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      return ticket.getPayload();
    } catch (error) {
      throw new Error("Token de Google inválido");
    }
  }

  // Método para manejar el inicio de sesión o registro de un usuario con Google
  async signInSSO(info: SsoAuthInfoDto): Promise<{
    user: Partial<User>;
    accessToken: string;
    refreshToken: string;
  }> {
    try {


      let user = await this.userModel.findOne({ email: info.data.user.email }).exec();

      if (!user) {
        user = await this.userService.create({
          email: info.data.user.email,
          name: info.data.user.name,
        });
      }

      const payload = { sub: user.id, username: user.name, roles: user.roles };
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: jwtSetting.JWT_REFRESH_SECRET,
        expiresIn: jwtSetting.JWT_REFRESH_EXPIRES,
      });
      const access_token = await this.jwtService.signAsync(payload);
      return {
        user: user,
        accessToken: access_token,
        refreshToken: refreshToken,
      };
    }
    catch (err: any) {
      console.error("[GoogleAuthService] signInSSO error:", err);
      // Detectamos un ValidationError de Mongoose
      if (err.name === 'ValidationError') {
        throw new BadRequestException(`Datos inválidos: ${Object.values(err.errors).map(e => (e as any).message).join(', ')}`);
      }
      // Otros errores
      throw err instanceof HttpException
        ? err
        : new InternalServerErrorException(err.message || 'Error interno');
    }
  }
}

