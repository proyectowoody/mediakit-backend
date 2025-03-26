import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('discountmediakit')
@Unique(['codigo'])
export class Discount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  codigo: string;

  @Column()
  descuento: number;
}
