import { IsOptional, IsString } from 'class-validator';

export class NotificationDto {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  userId?: string;  // Optionally, can target a specific user
}
