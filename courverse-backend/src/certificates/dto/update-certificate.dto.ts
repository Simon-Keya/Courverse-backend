import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCertificateDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  recipientName?: string;

  @IsNumber()
  @IsOptional()
  courseId?: number;

  @IsString()
  @IsOptional()
  issueDate?: string;
}
