import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Favorite } from 'src/favorite/entities/favorite.entity';
import { Car } from 'src/car/entities/car.entity';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { Detailbuy } from 'src/detailbuy/entities/detailbuy.entity';
import { ArticleImage } from './article-image.entity';

@Entity('articlemediakit')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, (categoria) => categoria.articulos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Category;

  @ManyToOne(() => Supplier, (supplier) => supplier.articulos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

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

  @Column({ type: 'int', default: 0, nullable: false })
  discount: number; 

  @Column({ type: 'int', default: 0, nullable: false })
  precioActual: number; 

  @Column({ type: 'boolean', default: false, nullable: false })
  offer: boolean;

  @OneToMany(() => Favorite, (favorito) => favorito.article)
  favoritos: Favorite[];

  @OneToMany(() => Car, (car) => car.article)
  car: Car[];

  @OneToMany(() => Detailbuy, (detailbuy) => detailbuy.article)
  detailbuy: Detailbuy[];

  @OneToMany(() => ArticleImage, (image) => image.article, { cascade: true, eager: true })
  imagenes: ArticleImage[];

  @BeforeInsert()
  setInitialPrecioActual() {
    this.precioActual = this.precio;
  }

  @BeforeUpdate()
  updatePrecioActual() {
    if (this.discount > 0 && this.discount <= 100) {
      const discountAmount = (this.precio * this.discount) / 100; 
      this.precioActual = this.precio - discountAmount;
    } else {
      this.precioActual = this.precio; 
    }

    if (this.precioActual < 0) {
      this.precioActual = 0; 
    }
  }
}
