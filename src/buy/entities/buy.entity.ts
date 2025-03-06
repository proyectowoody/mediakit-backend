import { User } from 'src/user/entities/user.entity';
import { Detailbuy } from 'src/detailbuy/entities/detailbuy.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    OneToMany
} from 'typeorm';
import { Comment } from 'src/comment/entities/comment.entity';

@Entity('buymediakit')
export class Buy  {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.buy, { onDelete: 'CASCADE' }) 
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn()
    fecha: Date;

    @OneToMany(() => Detailbuy, (detail) => detail.buy)
    details: Detailbuy[];  

    @OneToMany(() => Comment, (comment) => comment.buy)
    comment: Comment[];  
}
