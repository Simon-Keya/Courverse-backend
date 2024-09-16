import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Reward {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  points: number;  // Points required to redeem
}
