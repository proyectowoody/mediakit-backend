
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Article } from 'src/article/entities/article.entity';
import { Blog } from './blog.entity';

@Entity('blog_images')
export class BlogImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Blog, (blog) => blog.imagenes, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;

  @Column({ name: 'blog_id', nullable: true }) 
  blogId: number;

}
