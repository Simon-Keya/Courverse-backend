import { IsOptional } from 'class-validator';

export class UpdateAdminDto {
  @IsOptional()
  username?: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  email?: string;
}
