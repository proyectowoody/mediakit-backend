import { Article } from 'src/article/entities/article.entity';
import { Subcategory } from 'src/subcategory/entities/subcategory.entity';
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

  @Column({ nullable: true })
  imagen: string;

  @OneToMany(() => Subcategory, (subcategory) => subcategory.categoria)
  subcategorias: Subcategory[]; 

  @OneToMany(() => Article, (articulo) => articulo.categoria)
  articulos: Article[];

}
