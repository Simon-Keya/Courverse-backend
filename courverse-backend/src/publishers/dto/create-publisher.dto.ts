import { IsEmail, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreatePublisherDto {
  @IsString()
  @IsNotEmpty() // Ensures the name field is not empty
  name: string;

  @IsEmail() // Ensures a valid email format
  @IsNotEmpty() // Ensures the email field is not empty
  email: string;

  @IsString()
  @IsUrl() // Ensures the website field is a valid URL format
  @IsNotEmpty() // Ensures the website field is not empty
  website: string;
}
