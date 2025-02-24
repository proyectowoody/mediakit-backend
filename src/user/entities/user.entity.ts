import { Favorite } from 'src/favorite/entities/favorite.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';

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
  
}
