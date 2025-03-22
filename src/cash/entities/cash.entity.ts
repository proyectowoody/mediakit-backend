import { User } from 'src/user/entities/user.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('cashmediakit')
export class Cash {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.cash, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 500 })
  cash: string;

  @CreateDateColumn({ type: 'timestamp' })
  fecha: Date;
}
