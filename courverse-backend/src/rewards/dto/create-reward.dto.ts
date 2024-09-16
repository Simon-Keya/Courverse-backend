import { IsNumber, IsString } from 'class-validator';

export class CreateRewardDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  points: number;  // Points required to redeem this reward
}
