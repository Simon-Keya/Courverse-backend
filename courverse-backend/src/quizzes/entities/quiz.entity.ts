import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text', { array: true })
  questions: string[];

  @Column()
  duration: number;  // Duration in minutes

  @ManyToOne(() => Course, (course) => course.quizzes)
  course: Course;
}
