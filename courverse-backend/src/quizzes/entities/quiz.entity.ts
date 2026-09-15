import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from '../../courses/entities/course.entity';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', default: [] })
  questions: QuizQuestion[];

  @Column({ type: 'int', default: 10 })
  durationMinutes: number;

  @Column({ type: 'int', default: 70 })
  passingScore: number; // percentage

  @Column({ nullable: true })
  courseId?: string;

  @ManyToOne(() => Course, (course) => course.quizzes, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'courseId' })
  course?: Course;

  @Column({ nullable: true })
  lessonId?: string; // if attached to a lesson

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
