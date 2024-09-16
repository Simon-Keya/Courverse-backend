import { ArrayNotEmpty, IsArray, IsNumber, IsString } from 'class-validator';

export class CreateQuizDto {
  @IsString()
  title: string;

  @IsArray()
  @ArrayNotEmpty()
  questions: string[];

  @IsNumber()
  duration: number;  // Duration in minutes
}
