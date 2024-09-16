import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateChallengeDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  tasks?: string[];
}
