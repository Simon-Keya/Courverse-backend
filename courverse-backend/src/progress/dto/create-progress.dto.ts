import { IsNotEmpty } from 'class-validator';

export class CreateProgressDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  courseId: number;

  @IsNotEmpty()
  progressPercentage: number;
}
