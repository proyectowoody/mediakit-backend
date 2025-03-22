
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Buy } from "src/buy/entities/buy.entity";

@Entity('commentmediakit')
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.comment, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'text' })
    descripcion: string;

    @CreateDateColumn()
    fecha: Date;
}
