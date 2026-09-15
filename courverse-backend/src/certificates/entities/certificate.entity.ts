import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { User } from '../../users/entities/user.entity';

@Entity('certificates')
@Unique(['userId', 'courseId'])
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  credentialId: string;

  @Column()
  userId: string;

  @Column()
  courseId: string;

  @ManyToOne(() => User, (user) => user.certificates, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Course, (course) => course.certificates, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column()
  recipientName: string;

  @Column({ nullable: true })
  courseTitle?: string;

  @Column({ nullable: true })
  publisherName?: string;

  @CreateDateColumn()
  issuedAt: Date;
}
