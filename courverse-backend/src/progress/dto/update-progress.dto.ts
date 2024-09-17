import { IsOptional } from 'class-validator';

export class UpdateProgressDto {
  @IsOptional()
  userId?: number;

  @IsOptional()
  courseId?: number;

  @IsOptional()
  progressPercentage?: number;
}
