import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonProgress } from './entities/progress.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import { UsersModule } from '../users/users.module';
import { CertificatesModule } from '../certificates/certificates.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LessonProgress, Lesson]),
    EnrollmentsModule,
    UsersModule,
    CertificatesModule,
  ],
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}
