import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  Headers,
  UseGuards,
  Get,
  Req,
  BadRequestException,
} from "@nestjs/common";
import { Public } from "./public";
import { AuthService } from "./authentication.service";
import { SignInDto, SsoAuthInfoDto } from "./singin.dto";
import { RecoverPasswordDto, ResetPassDto } from "user/user.dto";
import { AuthGuard } from "./auth.guard";
import { GoogleAuthService } from "./google-auth-service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserService } from "user/user.service";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

@Controller("auth")
// @Public() // todos son publicos con este decorador!
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly userService: UserService
  ) {}
  /**
   * @param signInDto
   * @returns
   */

  @ApiBearerAuth()
  @ApiTags('authentication')
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
  async googleLogin(@Body() userInfo: SsoAuthInfoDto) {
    // console.log('📥 [googleLogin] Iniciando autenticación con Google SSO');
    // console.log('👉 Datos recibidos:', userInfo);

    try {
      const result = await this.googleAuthService.signInSSO(userInfo);
    //   console.log('✅ [googleLogin] Autenticación exitosa:', result);
      return result;
    } catch (error) {
    //   console.error('❌ [googleLogin] Error durante la autenticación:', error);

    //   // Desglose del error
    //   console.error('📝 Mensaje de error:', error.message || 'No hay mensaje');
    //   console.error('🛠️ Stack:', error.stack || 'No hay stack trace');
    //   console.error('🔑 Claves del error:', Object.keys(error));

      throw {
        message: error.message || 'Error desconocido durante la autenticación',
        stack: error.stack || 'No stack trace available',
        details: error.response || error,
      };
    } finally {
      console.log('🔚 [googleLogin] Finalizó el método googleLogin');
    }
  }

  @Get('whoami')
  async whoamiUser(@Req() request: Request) {
    const { sub } = request['user'] as JwtPayload;
    console.log(sub)
    // Convertir `sub` a ObjectId
    let objectId: Types.ObjectId;
    try {
      objectId = new Types.ObjectId(sub);
    } catch (error) {
      throw new BadRequestException('ID de usuario inválido');
    }

    const user = await this.userService.findByIdOrFail(objectId);
    const { password, resetKey, resetKeyTimeStamp, ...userWithoutPass } = user;

    return userWithoutPass;
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
