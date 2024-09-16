import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';

@Entity()
export class Certificate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  recipientName: string;

  @Column()
  issueDate: string;

  @ManyToOne(() => Course, (course) => course.certificates)
  course: Course;
}
