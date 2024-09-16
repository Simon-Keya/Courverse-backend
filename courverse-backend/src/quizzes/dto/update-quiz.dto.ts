import { ArrayNotEmpty, IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateQuizDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  questions?: string[];

  @IsNumber()
  @IsOptional()
  duration?: number;
}
