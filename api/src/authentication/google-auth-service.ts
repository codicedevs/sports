import { Injectable } from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { User } from "user/user.entity";

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client;

  constructor(
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
  async loginWithGoogle(googleToken: string) {
    const payload = await this.verifyGoogleToken(googleToken);

    // Verificar si el usuario ya existe en la base de datos
    let user = await this.userModel.findOne({ googleId: payload.sub });

    // Si el usuario no existe, lo creamos
    if (!user) {
      user = new this.userModel({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        avatar: payload.picture,
      });
      await user.save();
    }

    // Generar un JWT para el usuario autenticado
    const token = this.jwtService.sign({
      userId: user._id,
      email: user.email,
    });

    return { token, user };
  }
}
