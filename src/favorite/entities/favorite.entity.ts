import { Article } from 'src/article/entities/article.entity';
import { User } from 'src/user/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';
  
  @Entity('favoritemediakit')
  export class Favorite {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, (user) => user.favoritos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @ManyToOne(() => Article, (articulo) => articulo.favoritos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'articulo_id' })
    article: Article;
  
    @CreateDateColumn()
    fecha: Date;
  }
  