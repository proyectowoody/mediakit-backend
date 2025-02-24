import { Article } from 'src/article/entities/article.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

@Entity('categorymediakit')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @OneToMany(() => Article, (articulo) => articulo.categoria)
  articulos: Article[];
  
}
