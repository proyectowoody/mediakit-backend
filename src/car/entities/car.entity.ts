import { Article } from 'src/article/entities/article.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('carmediakit')
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.car, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Article, (article) => article.car, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'articulo_id' })
  article: Article;

  @Column({ type: 'int', default: 0 })
  discount?: number;

  @CreateDateColumn({ type: 'datetime' }) // para que coincida con DATETIME de MySQL
  fecha: Date;
}
