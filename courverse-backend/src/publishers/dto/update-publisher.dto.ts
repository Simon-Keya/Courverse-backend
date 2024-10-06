import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdatePublisherDto {
  @IsString()
  @IsOptional() // Optional field, not required in updates
  name?: string;

  @IsEmail()
  @IsOptional() // Optional field, not required in updates
  email?: string;

  @IsString()
  @IsUrl() // Ensures a valid URL format if provided
  @IsOptional() // Optional field, not required in updates
  website?: string;
}
