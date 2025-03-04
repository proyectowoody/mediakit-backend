import { Buy } from 'src/buy/entities/buy.entity';
import { Car } from 'src/car/entities/car.entity';
import { Favorite } from 'src/favorite/entities/favorite.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('usermediakit')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'enum', enum: ['admin', 'client'], default: 'client' })
  role: string;

  @OneToMany(() => Favorite, (favorito) => favorito.user)
  favoritos: Favorite[];

  @OneToMany(() => Car, (car) => car.user)
  car: Car[];

  @OneToMany(() => Buy, (buy) => buy.user)
  buy: Buy[];

}
