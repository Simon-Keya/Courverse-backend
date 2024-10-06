import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateChallengeDto {
  @IsString()
  @IsOptional()
  title?: string; // Optional title for the challenge

  @IsString()
  @IsOptional()
  description?: string; // Optional description for the challenge

  @IsArray()
  @IsOptional() // Allow tasks to be omitted
  tasks?: string[]; // Optional array of tasks related to the challenge
}
