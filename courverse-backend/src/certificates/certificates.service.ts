import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { Certificate } from './entities/certificate.entity';
import { Course } from '../courses/entities/course.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Idempotent: returns existing certificate if already issued.
   */
  async issueForCourseCompletion(
    userId: string,
    courseId: string,
  ): Promise<Certificate> {
    const existing = await this.certificateRepository.findOne({
      where: { userId, courseId },
      relations: ['course', 'user'],
    });
    if (existing) return existing;

    const [user, course] = await Promise.all([
      this.userRepository.findOne({ where: { id: userId } }),
      this.courseRepository.findOne({
        where: { id: courseId },
        relations: ['publisher'],
      }),
    ]);
    if (!user) throw new NotFoundException('User not found');
    if (!course) throw new NotFoundException('Course not found');

    const recipientName =
      [user.firstName, user.lastName].filter(Boolean).join(' ') ||
      user.username;

    const credentialId = `CV-${randomBytes(4).toString('hex').toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    const cert = this.certificateRepository.create({
      userId,
      courseId,
      credentialId,
      recipientName,
      courseTitle: course.title,
      publisherName: course.publisher?.name,
    });
    return this.certificateRepository.save(cert);
  }

  async findMyCertificates(userId: string): Promise<Certificate[]> {
    return this.certificateRepository.find({
      where: { userId },
      relations: ['course', 'course.publisher'],
      order: { issuedAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Certificate> {
    const certificate = await this.certificateRepository.findOne({
      where: { id },
      relations: ['course', 'user', 'course.publisher'],
    });
    if (!certificate) {
      throw new NotFoundException(`Certificate not found`);
    }
    return certificate;
  }

  async findByCredentialId(credentialId: string): Promise<Certificate> {
    const certificate = await this.certificateRepository.findOne({
      where: { credentialId },
      relations: ['course', 'user', 'course.publisher'],
    });
    if (!certificate) {
      throw new NotFoundException(`Certificate not found`);
    }
    return certificate;
  }

  async findAll(): Promise<Certificate[]> {
    return this.certificateRepository.find({
      relations: ['course', 'user'],
      order: { issuedAt: 'DESC' },
      take: 100,
    });
  }
}
