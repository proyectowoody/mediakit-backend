import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity('addressmediakit')
export class Address {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 50, default: 'España' })
  pais: string;

  @Column({ type: 'varchar', length: 100 })
  provincia: string;

  @Column({ type: 'varchar', length: 100 })
  localidad: string;

  @Column({ type: 'varchar', length: 5 })
  codigo_postal: string;

  @Column({ type: 'varchar', length: 255 })
  tipo_via: string;

  @Column({ type: 'boolean', default: false })
  envio: boolean;

  @Column({ type: 'boolean', default: false })
  facturacion: boolean;

  @Column({ type: 'text', nullable: true })
  adicional: string;

  @Column({ type: 'text', nullable: true })
  indicacion: string;

  @CreateDateColumn()
  fecha: Date;
}