import { IsEmail, IsString } from 'class-validator';

export class CreatePublisherDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  website: string;
}
