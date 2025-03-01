
import { Article } from 'src/article/entities/article.entity';
import { User } from 'src/user/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
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
  
    @ManyToOne(() => Article, (articulo) => articulo.car, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'articulo_id' })
    article: Article;
  
    @CreateDateColumn()
    fecha: Date;
  }
  