import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Article } from 'src/article/entities/article.entity';

@Entity('article_images')
export class ArticleImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Article, (article) => article.imagenes, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'article_id' })
  article: Article;

  @Column({ name: 'article_id', nullable: true }) 
  articleId: number;

}
