import { IsEmail, IsInt, IsString } from 'class-validator';

export class AddMessageDto {
  @IsString()
  @IsEmail()
  sender: string;

  @IsString()
  message: string;
}
