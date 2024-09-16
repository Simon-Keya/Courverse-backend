import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Publisher } from '../../publishers/entities/publisher.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  category: string;

  @ManyToOne(() => Publisher, (publisher) => publisher.courses)
  publisher: Publisher;
}
