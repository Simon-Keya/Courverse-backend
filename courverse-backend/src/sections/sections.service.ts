import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Section } from './entities/section.entity';
import { Course } from '../courses/entities/course.entity';
import { PublishersService } from '../publishers/publishers.service';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section)
    private readonly sectionRepo: Repository<Section>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    private readonly publishersService: PublishersService,
  ) {}

  async create(courseId: string, title: string, user: { id: string; role: string }) {
    await this.assertCanEditCourse(courseId, user);
    const maxOrder = await this.sectionRepo
      .createQueryBuilder('s')
      .where('s.courseId = :courseId', { courseId })
      .select('MAX(s.orderIndex)', 'max')
      .getRawOne();
    const section = this.sectionRepo.create({
      courseId,
      title,
      orderIndex: (maxOrder?.max ?? -1) + 1,
    });
    return this.sectionRepo.save(section);
  }

  async update(id: string, data: Partial<Section>, user: { id: string; role: string }) {
    const section = await this.sectionRepo.findOne({ where: { id } });
    if (!section) throw new NotFoundException('Section not found');
    await this.assertCanEditCourse(section.courseId, user);
    Object.assign(section, { title: data.title ?? section.title, description: data.description });
    return this.sectionRepo.save(section);
  }

  async remove(id: string, user: { id: string; role: string }) {
    const section = await this.sectionRepo.findOne({ where: { id } });
    if (!section) throw new NotFoundException('Section not found');
    await this.assertCanEditCourse(section.courseId, user);
    await this.sectionRepo.remove(section);
  }

  private async assertCanEditCourse(courseId: string, user: { id: string; role: string }) {
    if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) return;
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');
    const publisher = await this.publishersService.findByUserId(user.id);
    if (!publisher || publisher.id !== course.publisherId) {
      throw new ForbiddenException('Not allowed to edit this course');
    }
  }
}
