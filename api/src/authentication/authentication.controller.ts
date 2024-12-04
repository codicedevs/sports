import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  Headers,
  UseGuards,
  Get,
} from "@nestjs/common";
import { Public } from "./public";
import { AuthService } from "./authentication.service";
import { SignInDto } from "./singin.dto";
import { RecoverPasswordDto, ResetPassDto } from "user/user.dto";
import { AuthGuard } from "./auth.guard";
import { GoogleAuthService } from "./google-auth-service";

@Controller("auth")
// @Public() // todos son publicos con este decorador!
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}
  /**
   * @param signInDto
   * @returns
   */

  @Public()
  @Post("signin")
  async signIn(@Body() signInDto: SignInDto) {
    try {
      const result = await this.authService.signIn(
        signInDto.email,
        signInDto.password,
      );
      return result;
    } catch (error) {
      console.log(error.message);
      // Manejar los errores, por ejemplo, lanzar un error 401 Unauthorized si las credenciales son inválidas.
      throw new UnauthorizedException("Credenciales incorrectas");
    }
  }
  /**
   * @param token
   * @returns
   */
  @Public()
  @Post("google")
  async googleLogin(@Body("token") token: string) {
    try {
      const result = await this.googleAuthService.loginWithGoogle(token);
      return result; // Devolvemos el JWT y el usuario al frontend
    } catch (error) {
      return { message: "Error de autenticación", error };
    }
  }

  /**
   * @param refreshToken
   * @returns
   * esta ruta esta marcada como publica, pero si el refresh token no es valido, el servicio entraga un error de no autorizado
   */

  @Public()
  @Post("refresh-token")
  async refreshAccessToken(@Headers("refresh-token") refreshToken: string) {
    try {
      const result = await this.authService.refreshToken(refreshToken);
      return result;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
  /**
   * @param email
   * @returns
   */
  @Public()
  @Post("recover-password")
  async recoverPassword(@Body() recoverPassword: RecoverPasswordDto) {
    const result = await this.authService.passwordRecovery(
      recoverPassword.email,
    );
    return {
      message: "Password recovery initiated successfully",
      data: result,
    };
  }
  /**
   * @param resetPass
   * @returns
   */
  @Public()
  @Post("reset-password")
  async resetPassword(@Body() resetPass: ResetPassDto) {
    await this.authService.resetPassword(resetPass);
    return { message: "Password reset successful" };
  }

  @UseGuards(AuthGuard)
  @Get("protected")
  getProtected() {
    return { message: "This is a protected route" };
  }

  @Public()
  @Post("logout")
  async logout(@Body("refreshToken") refreshToken: string) {
    return this.authService.logOut(refreshToken);
  }
}
