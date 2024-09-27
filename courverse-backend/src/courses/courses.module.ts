import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from '../certificates/entities/certificate.entity';
import { Challenge } from '../challenges/entities/challenge.entity';
import { Publisher } from '../publishers/entities/publisher.entity';
import { Quiz } from '../quizzes/entities/quiz.entity';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Publisher, Challenge, Certificate, Quiz]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
