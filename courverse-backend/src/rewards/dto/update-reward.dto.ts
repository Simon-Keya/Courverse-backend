import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRewardDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  points?: number;
}
