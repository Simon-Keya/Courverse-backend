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
import { Certificate } from '../../certificates/entities/certificate.entity';
import { Challenge } from '../../challenges/entities/challenge.entity';
import { Publisher } from '../../publishers/entities/publisher.entity';
import { Quiz } from '../../quizzes/entities/quiz.entity';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';
import { Section } from '../../sections/entities/section.entity';
import { Category } from '../../categories/entities/category.entity';
import { Review } from '../../reviews/entities/review.entity';

export enum CourseStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum CourseDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  ALL_LEVELS = 'all_levels',
}

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  shortDescription?: string;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column({ nullable: true })
  trailerUrl?: string;

  @Column({
    type: 'enum',
    enum: CourseDifficulty,
    default: CourseDifficulty.BEGINNER,
  })
  difficulty: CourseDifficulty;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ default: false })
  isFree: boolean;

  @Column({ default: false })
  isPremium: boolean;

  @Column({
    type: 'enum',
    enum: CourseStatus,
    default: CourseStatus.DRAFT,
  })
  status: CourseStatus;

  @Column({ type: 'int', default: 0 })
  durationMinutes: number;

  @Column({ type: 'int', default: 0 })
  lessonCount: number;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  ratingCount: number;

  @Column({ type: 'int', default: 0 })
  enrollmentCount: number;

  @Column({ type: 'text', array: true, default: [] })
  learningOutcomes: string[];

  @Column({ type: 'text', array: true, default: [] })
  requirements: string[];

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @Column({ nullable: true })
  categoryId?: string;

  @ManyToOne(() => Category, (category) => category.courses, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'categoryId' })
  category?: Category;

  @Column()
  publisherId: string;

  @ManyToOne(() => Publisher, (publisher) => publisher.courses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'publisherId' })
  publisher: Publisher;

  @OneToMany(() => Section, (section) => section.course)
  sections: Section[];

  @OneToMany(() => Challenge, (challenge) => challenge.course)
  challenges: Challenge[];

  @OneToMany(() => Certificate, (certificate) => certificate.course)
  certificates: Certificate[];

  @OneToMany(() => Quiz, (quiz) => quiz.course)
  quizzes: Quiz[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  @OneToMany(() => Review, (review) => review.course)
  reviews: Review[];

  @Column({ type: 'timestamp', nullable: true })
  publishedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
