import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { BlogImage } from './blog-image.entity';

@Entity('blogmediakit')
export class Blog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 10 })
    titulo: string;

    @Column({ type: 'text' })
    descripcion: string;

    @Column({ length: 10, unique: true })
    slug: string;

    @Column({ length: 10 })
    categoria: string;

    @Column({ type: 'text' })
    contenido: string;

    @CreateDateColumn()
    fecha: Date;

    @OneToMany(() => BlogImage, (image) => image.blog, { cascade: true, eager: true })
    imagenes: BlogImage[];
}
