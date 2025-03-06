
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Buy } from "src/buy/entities/buy.entity";

@Entity('commentmediakit')
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.comment, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Buy, (buy) => buy.comment, { onDelete: 'CASCADE' })
    buy: Buy;

    @Column({ type: 'text' })
    descripcion: string;

    @CreateDateColumn()
    fecha_creacion: Date;
}
