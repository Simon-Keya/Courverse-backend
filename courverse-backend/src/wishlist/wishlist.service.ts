import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItem } from './entities/wishlist.entity';
import { Course } from '../courses/entities/course.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItem)
    private readonly wishlistRepo: Repository<WishlistItem>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  async add(userId: string, courseId: string) {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');
    const existing = await this.wishlistRepo.findOne({ where: { userId, courseId } });
    if (existing) throw new ConflictException('Already in wishlist');
    return this.wishlistRepo.save(
      this.wishlistRepo.create({ userId, courseId }),
    );
  }

  async remove(userId: string, courseId: string) {
    const item = await this.wishlistRepo.findOne({ where: { userId, courseId } });
    if (!item) throw new NotFoundException('Not in wishlist');
    await this.wishlistRepo.remove(item);
    return { success: true };
  }

  async list(userId: string) {
    return this.wishlistRepo.find({
      where: { userId },
      relations: ['course', 'course.publisher', 'course.category'],
      order: { createdAt: 'DESC' },
    });
  }

  async has(userId: string, courseId: string) {
    const item = await this.wishlistRepo.findOne({ where: { userId, courseId } });
    return { inWishlist: !!item };
  }
}
