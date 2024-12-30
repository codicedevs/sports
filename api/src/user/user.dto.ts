import { Role } from "authorization/role.enum";
import {
  IsEmail,
  MaxLength,
  MinLength,
  IsEnum,
  IsOptional,
  IsArray,
} from "class-validator";
import { Profile, User } from "user/user.entity";
import { ObjectId } from "mongodb";


export class CreateUserDto {
  @MinLength(4)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsArray()
  friends?: ObjectId[]; // Array of ObjectIds referencing User documents

  @IsOptional()
  matches?: ObjectId[];

  @IsEnum(Role, { each: true })
  @IsOptional()
  roles?: Role[];

  @IsOptional()
  pushToken?: string;
}

export class UpdateUserDto {
  @MinLength(4)
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @MinLength(8)
  @IsOptional()
  password?: string;

  @IsOptional()
  friends?: User[];

  @IsOptional()
  matches?: ObjectId[];

  @IsOptional()
  resetKey?: string;

  @IsOptional()
  resetKeyTimeStamp?: string;

  @IsOptional()
  pushToken?: string;

  @IsOptional()
  profile?: Profile;
}

export class ResetPassDto {
  @MinLength(5)
  @MaxLength(6)
  resetKey: string;
  @IsEmail()
  email: string;
  @MinLength(8)
  password: string;
}

export class RecoverPasswordDto {
  @IsEmail()
  email: string;
}
