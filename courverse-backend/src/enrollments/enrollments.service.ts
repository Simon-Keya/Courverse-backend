import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Enrollment, EnrollmentStatus } from './entities/enrollment.entity';
import { Course, CourseStatus } from '../courses/entities/course.entity';
import { UsersService } from '../users/users.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async enroll(userId: string, dto: CreateEnrollmentDto): Promise<Enrollment> {
    const course = await this.courseRepo.findOne({
      where: { id: dto.courseId },
    });
    if (!course) throw new NotFoundException('Course not found');
    if (course.status !== CourseStatus.PUBLISHED) {
      throw new ForbiddenException('Course is not available for enrollment');
    }

    const existing = await this.enrollmentRepo.findOne({
      where: { userId, courseId: dto.courseId },
    });
    if (existing) {
      throw new ConflictException('Already enrolled in this course');
    }

    return this.dataSource.transaction(async (manager) => {
      const enrollment = manager.create(Enrollment, {
        userId,
        courseId: dto.courseId,
        status: EnrollmentStatus.ACTIVE,
        progressPercentage: 0,
        completedLessons: 0,
        totalLessons: course.lessonCount || 0,
        lastAccessedAt: new Date(),
      });
      const saved = await manager.save(enrollment);

      // Increment enrollment count
      await manager.increment(Course, { id: dto.courseId }, 'enrollmentCount', 1);

      return saved;
    });
  }

  async findMyEnrollments(userId: string): Promise<Enrollment[]> {
    return this.enrollmentRepo.find({
      where: { userId },
      relations: ['course', 'course.publisher', 'course.category'],
      order: { lastAccessedAt: 'DESC' },
    });
  }

  async findOne(userId: string, courseId: string): Promise<Enrollment | null> {
    return this.enrollmentRepo.findOne({
      where: { userId, courseId },
      relations: ['course'],
    });
  }

  async updateProgress(
    userId: string,
    courseId: string,
    progressPercentage: number,
    completedLessons: number,
  ): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepo.findOne({
      where: { userId, courseId },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    enrollment.progressPercentage = Math.min(100, Math.max(0, progressPercentage));
    enrollment.completedLessons = completedLessons;
    enrollment.lastAccessedAt = new Date();

    if (enrollment.progressPercentage >= 100 && enrollment.status === EnrollmentStatus.ACTIVE) {
      enrollment.status = EnrollmentStatus.COMPLETED;
      enrollment.completedAt = new Date();
    }

    return this.enrollmentRepo.save(enrollment);
  }
}
