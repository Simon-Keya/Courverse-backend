import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Progress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  courseId: number;

  @Column()
  progressPercentage: number;
}
