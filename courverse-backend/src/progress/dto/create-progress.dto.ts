import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProgressDto {
  @IsNotEmpty()
  @IsNumber()
  courseId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  progressPercentage: number; // Ensure this property is defined
}
