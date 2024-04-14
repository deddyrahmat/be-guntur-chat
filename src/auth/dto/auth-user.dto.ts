import { IsEmail, IsString } from 'class-validator';

export class AuthUser {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
