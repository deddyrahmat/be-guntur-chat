import { IsEmail, IsInt, IsString } from 'class-validator';

export class AddMessageDto {
  @IsString()
  @IsEmail()
  sender: string;

  @IsString()
  @IsEmail()
  receiver: string;

  @IsString()
  createdAt: string;

  @IsString()
  message: string;
}
