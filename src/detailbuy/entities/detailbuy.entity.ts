import { Article } from 'src/article/entities/article.entity';
import { Buy } from 'src/buy/entities/buy.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';

@Entity('detailbuymediakit')
export class Detailbuy {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Buy, (buy) => buy.details, { onDelete: 'CASCADE' }) 
    @JoinColumn({ name: 'buy_id' })
    buy: Buy;

    @ManyToOne(() => Article, (article) => article.detailbuy, { onDelete: 'CASCADE' }) 
    @JoinColumn({ name: 'articulo_id' })
    article: Article;

    @CreateDateColumn()
    fecha: Date;
}
