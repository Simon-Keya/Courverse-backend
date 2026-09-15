import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson, LessonType } from './entities/lesson.entity';
import { Section } from '../sections/entities/section.entity';
import { Course } from '../courses/entities/course.entity';
import { PublishersService } from '../publishers/publishers.service';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,
    @InjectRepository(Section)
    private readonly sectionRepo: Repository<Section>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    private readonly publishersService: PublishersService,
  ) {}

  async create(
    sectionId: string,
    data: { title: string; type?: LessonType; content?: string; videoUrl?: string; durationMinutes?: number; isPreview?: boolean },
    user: { id: string; role: string },
  ) {
    const section = await this.sectionRepo.findOne({ where: { id: sectionId } });
    if (!section) throw new NotFoundException('Section not found');
    await this.assertCanEditCourse(section.courseId, user);

    const maxOrder = await this.lessonRepo
      .createQueryBuilder('l')
      .where('l.sectionId = :sectionId', { sectionId })
      .select('MAX(l.orderIndex)', 'max')
      .getRawOne();

    const lesson = this.lessonRepo.create({
      sectionId,
      title: data.title,
      type: data.type || LessonType.VIDEO,
      content: data.content,
      videoUrl: data.videoUrl,
      durationMinutes: data.durationMinutes || 0,
      isPreview: data.isPreview || false,
      orderIndex: (maxOrder?.max ?? -1) + 1,
    });
    const saved = await this.lessonRepo.save(lesson);
    await this.recalcLessonCount(section.courseId);
    return saved;
  }

  async update(id: string, data: Partial<Lesson>, user: { id: string; role: string }) {
    const lesson = await this.lessonRepo.findOne({
      where: { id },
      relations: ['section'],
    });
    if (!lesson) throw new NotFoundException('Lesson not found');
    await this.assertCanEditCourse(lesson.section.courseId, user);
    Object.assign(lesson, {
      title: data.title ?? lesson.title,
      type: data.type ?? lesson.type,
      content: data.content ?? lesson.content,
      videoUrl: data.videoUrl ?? lesson.videoUrl,
      durationMinutes: data.durationMinutes ?? lesson.durationMinutes,
      isPreview: data.isPreview ?? lesson.isPreview,
    });
    return this.lessonRepo.save(lesson);
  }

  async remove(id: string, user: { id: string; role: string }) {
    const lesson = await this.lessonRepo.findOne({
      where: { id },
      relations: ['section'],
    });
    if (!lesson) throw new NotFoundException('Lesson not found');
    const courseId = lesson.section.courseId;
    await this.assertCanEditCourse(courseId, user);
    await this.lessonRepo.remove(lesson);
    await this.recalcLessonCount(courseId);
  }

  private async recalcLessonCount(courseId: string) {
    const count = await this.lessonRepo
      .createQueryBuilder('l')
      .innerJoin('l.section', 's')
      .where('s.courseId = :courseId', { courseId })
      .getCount();
    await this.courseRepo.update(courseId, { lessonCount: count });
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
