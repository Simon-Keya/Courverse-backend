import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class UpdateProgressDto {
  @IsOptional()
  @IsNumber()
  @IsPositive() // Ensure the user ID is a positive number if provided
  userId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive() // Ensure the course ID is a positive number if provided
  courseId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive() // Ensure progress percentage is a positive number if provided
  progressPercentage?: number;
}
