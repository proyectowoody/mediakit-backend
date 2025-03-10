import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from 'src/category/entities/category.entity';

@Entity('subcategorymediakit')
export class Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @ManyToOne(() => Category, (category) => category.subcategorias, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Category; 

}