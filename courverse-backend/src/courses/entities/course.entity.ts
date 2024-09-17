import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Certificate } from '../../certificates/entities/certificate.entity'; // Import the Certificate entity
import { Challenge } from '../../challenges/entities/challenge.entity';
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

  @OneToMany(() => Challenge, (challenge) => challenge.course)
  challenges: Challenge[];

  @OneToMany(() => Certificate, (certificate) => certificate.course) // Add this line
  certificates: Certificate[]; // Add this property
}
