import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity('addressmediakit')
export class Address {
  
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'varchar', length: 255 })
  calle: string;

  @Column({ type: 'varchar', length: 10 })
  numero: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  piso_puerta?: string;

  @Column({ type: 'varchar', length: 5 })
  codigo_postal: string;

  @Column({ type: 'varchar', length: 100 })
  ciudad: string;

  @Column({ type: 'varchar', length: 100 })
  provincia: string;

  @Column({ type: 'varchar', length: 100 })
  comunidad_autonoma: string;

  @Column({ type: 'varchar', length: 50, default: 'España' })
  pais: string;

  @CreateDateColumn()
  fecha_creacion: Date;
}
