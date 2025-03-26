import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity('datausermediakit')
export class Datauser {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.datauser, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'date' })
    fecha_nacimiento: Date;

    @Column({ type: 'varchar', length: 50 })
    tipo_documento: string;

    @Column({ type: 'varchar', length: 100 })
    numero_documento: string;

    @Column({
        type: 'enum',
        enum: ['Masculino', 'Femenino', 'No identificado'],
    })
    genero: string;

    @Column({ type: 'varchar', length: 20 })
    telefono: string;

    @CreateDateColumn()
    fecha_creacion: Date;
}
