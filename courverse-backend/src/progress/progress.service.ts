import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { LessonProgress } from './entities/progress.entity';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { UsersService } from '../users/users.service';
import { CertificatesService } from '../certificates/certificates.service';
import { Lesson } from '../lessons/entities/lesson.entity';
import { EnrollmentStatus } from '../enrollments/entities/enrollment.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(LessonProgress)
    private readonly progressRepo: Repository<LessonProgress>,
    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,
    private readonly enrollmentsService: EnrollmentsService,
    private readonly usersService: UsersService,
    private readonly certificatesService: CertificatesService,
    private readonly dataSource: DataSource,
  ) {}

  async completeLesson(userId: string, lessonId: string) {
    const lesson = await this.lessonRepo.findOne({
      where: { id: lessonId },
      relations: ['section'],
    });
    if (!lesson) throw new NotFoundException('Lesson not found');

    const courseId = lesson.section?.courseId;
    if (!courseId) throw new NotFoundException('Course not found for lesson');

    return this.dataSource.transaction(async (manager) => {
      let progress = await manager.findOne(LessonProgress, {
        where: { userId, lessonId },
      });

      if (progress?.isCompleted) {
        return { progress, certificate: null, alreadyCompleted: true };
      }

      if (!progress) {
        progress = manager.create(LessonProgress, {
          userId,
          lessonId,
          courseId,
          isCompleted: true,
          progressPercentage: 100,
          completedAt: new Date(),
        });
      } else {
        progress.isCompleted = true;
        progress.progressPercentage = 100;
        progress.completedAt = new Date();
      }
      await manager.save(progress);

      const completedCount = await manager.count(LessonProgress, {
        where: { userId, courseId, isCompleted: true },
      });

      const totalLessons = await manager
        .createQueryBuilder(Lesson, 'l')
        .innerJoin('l.section', 's')
        .where('s.courseId = :courseId', { courseId })
        .getCount();

      const percentage =
        totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

      await this.enrollmentsService.updateProgress(
        userId,
        courseId,
        percentage,
        completedCount,
      );

      await this.usersService.addXp(userId, 25);

      let certificate = null;
      if (percentage >= 100) {
        // Issue certificate (idempotent)
        certificate = await this.certificatesService.issueForCourseCompletion(
          userId,
          courseId,
        );
        // Bonus XP for course completion
        await this.usersService.addXp(userId, 100);
      }

      return { progress, certificate, alreadyCompleted: false };
    });
  }

  async getCourseProgress(userId: string, courseId: string) {
    return this.progressRepo.find({
      where: { userId, courseId },
      relations: ['lesson'],
    });
  }

  async getLessonProgress(userId: string, lessonId: string) {
    return this.progressRepo.findOne({ where: { userId, lessonId } });
  }
}
