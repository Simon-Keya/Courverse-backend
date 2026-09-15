import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course, CourseStatus, CourseDifficulty } from './entities/course.entity';
import { UserRole } from '../users/entities/user.entity';
import { PublishersService } from '../publishers/publishers.service';

export interface CourseQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  publisherId?: string;
  difficulty?: CourseDifficulty;
  status?: CourseStatus;
  isFree?: boolean;
  sort?: 'newest' | 'popular' | 'rating' | 'price_asc' | 'price_desc';
  includeAllStatuses?: boolean;
}

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly publishersService: PublishersService,
  ) {}

  async create(createCourseDto: CreateCourseDto, userId: string): Promise<Course> {
    let publisherId = createCourseDto.publisherId;
    if (!publisherId) {
      const publisher = await this.publishersService.findByUserId(userId);
      if (!publisher) {
        throw new ForbiddenException(
          'No publisher profile linked to this account. Contact admin.',
        );
      }
      publisherId = publisher.id;
    }
    const slug = this.generateSlug(createCourseDto.title);
    const course = this.courseRepository.create({
      ...createCourseDto,
      slug,
      publisherId,
      status: CourseStatus.DRAFT,
    });
    return this.courseRepository.save(course);
  }

  async findAll(query: CourseQuery = {}) {
    const {
      page = 1,
      limit = 12,
      search,
      categoryId,
      publisherId,
      difficulty,
      status,
      isFree,
      sort = 'newest',
    } = query;

    const qb = this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.publisher', 'publisher')
      .leftJoinAndSelect('course.category', 'category');

    // Default public list to published only when status not explicitly passed
    if (!query.includeAllStatuses) {
      const effectiveStatus = status !== undefined ? status : CourseStatus.PUBLISHED;
      if (effectiveStatus) {
        qb.andWhere('course.status = :status', { status: effectiveStatus });
      }
    } else if (status) {
      qb.andWhere('course.status = :status', { status });
    }
    if (search) {
      qb.andWhere(
        '(course.title ILIKE :search OR course.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }
    if (categoryId) {
      qb.andWhere('course.categoryId = :categoryId', { categoryId });
    }
    if (publisherId) {
      qb.andWhere('course.publisherId = :publisherId', { publisherId });
    }
    if (difficulty) {
      qb.andWhere('course.difficulty = :difficulty', { difficulty });
    }
    if (typeof isFree === 'boolean') {
      qb.andWhere('course.isFree = :isFree', { isFree });
    }

    switch (sort) {
      case 'popular':
        qb.orderBy('course.enrollmentCount', 'DESC');
        break;
      case 'rating':
        qb.orderBy('course.rating', 'DESC');
        break;
      case 'price_asc':
        qb.orderBy('course.price', 'ASC');
        break;
      case 'price_desc':
        qb.orderBy('course.price', 'DESC');
        break;
      default:
        qb.orderBy('course.createdAt', 'DESC');
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['publisher', 'category', 'sections', 'sections.lessons'],
      order: {
        sections: { orderIndex: 'ASC' },
      },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    // Sort lessons inside sections
    if (course.sections) {
      course.sections.forEach((s) => {
        if (s.lessons) {
          s.lessons.sort((a, b) => a.orderIndex - b.orderIndex);
        }
      });
    }
    return course;
  }

  async findBySlug(slug: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { slug },
      relations: ['publisher', 'category', 'sections', 'sections.lessons'],
    });
    if (!course) {
      throw new NotFoundException(`Course not found`);
    }
    return course;
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
    currentUser: { id: string; role: UserRole },
  ): Promise<Course> {
    const course = await this.findOne(id);
    this.assertCanModify(course, currentUser);
    Object.assign(course, updateCourseDto);
    return this.courseRepository.save(course);
  }

  async submitForReview(id: string, currentUser: { id: string; role: UserRole }) {
    const course = await this.findOne(id);
    this.assertCanModify(course, currentUser);
    if (course.status !== CourseStatus.DRAFT && course.status !== CourseStatus.REJECTED) {
      throw new ForbiddenException('Only draft or rejected courses can be submitted');
    }
    course.status = CourseStatus.SUBMITTED;
    return this.courseRepository.save(course);
  }

  async approve(id: string) {
    const course = await this.findOne(id);
    course.status = CourseStatus.APPROVED;
    return this.courseRepository.save(course);
  }

  async publish(id: string) {
    const course = await this.findOne(id);
    if (course.status !== CourseStatus.APPROVED && course.status !== CourseStatus.PUBLISHED) {
      throw new ForbiddenException('Course must be approved before publishing');
    }
    course.status = CourseStatus.PUBLISHED;
    course.publishedAt = new Date();
    return this.courseRepository.save(course);
  }

  async reject(id: string) {
    const course = await this.findOne(id);
    course.status = CourseStatus.REJECTED;
    return this.courseRepository.save(course);
  }

  async remove(id: string, currentUser: { id: string; role: UserRole }): Promise<void> {
    const course = await this.findOne(id);
    this.assertCanModify(course, currentUser);
    await this.courseRepository.remove(course);
  }



  async findMineForUser(userId: string, query: CourseQuery = {}) {
    const publisher = await this.publishersService.findByUserId(userId);
    if (!publisher) {
      return { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } };
    }
    return this.findAll({
      ...query,
      publisherId: publisher.id,
      includeAllStatuses: query.includeAllStatuses ?? !query.status,
    });
  }

  async findByPublisher(publisherId: string, query: CourseQuery = {}) {
    return this.findAll({ ...query, publisherId, status: query.status });
  }

  async findPendingReview(query: CourseQuery = {}) {
    return this.findAll({ ...query, status: CourseStatus.SUBMITTED });
  }

  private assertCanModify(course: Course, user: { id: string; role: UserRole }) {
    if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) return;
    // Publisher ownership — need publisher.userId match; for now allow if role is publisher
    // Full ownership check requires joining publisher.userId
    if (user.role !== UserRole.PUBLISHER) {
      throw new ForbiddenException('Not allowed to modify this course');
    }
  }

  private generateSlug(title: string): string {
    return (
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Date.now().toString(36)
    );
  }
}
