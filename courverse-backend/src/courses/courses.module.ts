import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from '../certificates/entities/certificate.entity';
import { Challenge } from '../challenges/entities/challenge.entity';
import { Publisher } from '../publishers/entities/publisher.entity';
import { Quiz } from '../quizzes/entities/quiz.entity';
import { Section } from '../sections/entities/section.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { Category } from '../categories/entities/category.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { Review } from '../reviews/entities/review.entity';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { PublishersModule } from '../publishers/publishers.module';
import { Course } from './entities/course.entity';

@Module({
  imports: [
    PublishersModule,
    TypeOrmModule.forFeature([
      Course,
      Publisher,
      Challenge,
      Certificate,
      Quiz,
      Section,
      Lesson,
      Category,
      Enrollment,
      Review,
    ]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
