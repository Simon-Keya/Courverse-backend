import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdatePublisherDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  website?: string;
}
