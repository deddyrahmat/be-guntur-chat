import { IsString } from 'class-validator';

export class AddMessageDto {
  @IsString()
  author: string;

  @IsString()
  body: string;
}
