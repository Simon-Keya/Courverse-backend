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

  @IsString() // Add the title property
  @IsOptional() // Make the title optional
  title?: string; // Title of the certificate
}
