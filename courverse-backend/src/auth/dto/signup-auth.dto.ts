import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignupAuthDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
