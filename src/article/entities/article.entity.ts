import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Favorite } from 'src/favorite/entities/favorite.entity';
import { ArticleImage } from './articleImage.entity';

@Entity('articlemediakit')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, (categoria) => categoria.articulos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Category;

  @Column()
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @CreateDateColumn()
  fecha: Date;

  @Column()
  estado: string;

  @Column()
  precio: number;

  @OneToMany(() => Favorite, (favorito) => favorito.article)
  favoritos: Favorite[];

  @OneToMany(() => ArticleImage, (imagen) => imagen.article, { cascade: true })
  imagenes: ArticleImage[];
}
