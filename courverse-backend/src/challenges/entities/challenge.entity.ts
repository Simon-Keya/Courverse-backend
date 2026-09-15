import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from '../../courses/entities/course.entity';

@Entity('challenges')
export class Challenge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', array: true, default: [] })
  tasks: string[];

  @Column({ type: 'int', default: 100 })
  xpReward: number;

  @Column({ nullable: true })
  courseId?: string;

  @ManyToOne(() => Course, (course) => course.challenges, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'courseId' })
  course?: Course;

  @Column({ nullable: true })
  lessonId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
