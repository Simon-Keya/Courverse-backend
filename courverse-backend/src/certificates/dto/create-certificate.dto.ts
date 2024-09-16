import { IsNumber, IsString } from 'class-validator';

export class CreateCertificateDto {
  @IsString()
  name: string;

  @IsString()
  recipientName: string;

  @IsNumber()
  courseId: number;  // Foreign key reference to Course

  @IsString()
  issueDate: string;  // Date when the certificate is issued
}
