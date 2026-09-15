import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { Section } from '../sections/entities/section.entity';
import { Course } from '../courses/entities/course.entity';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { PublishersModule } from '../publishers/publishers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson, Section, Course]),
    PublishersModule,
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}
