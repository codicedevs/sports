import { IsEmail, MinLength } from "class-validator";

export class SignInDto {
  @IsEmail()
  email: string;
  @MinLength(8)
  password: string;
}

// auth-response.dto.ts

export class SsoAuthInfoDto {
  data: AuthDataDto;
  type: 'success' | 'error';
}

 class AuthDataDto {
  idToken: string | null;
  scopes: string[];
  serverAuthCode: string | null;
  user: AuthUserDto;
}

 class AuthUserDto {
  email: string;
  familyName: string;
  givenName: string;
  id: string;
  name: string;
  photo: string | null;
}
