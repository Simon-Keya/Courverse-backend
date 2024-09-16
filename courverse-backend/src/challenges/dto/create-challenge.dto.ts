import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class CreateChallengeDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  tasks: string[];
}
