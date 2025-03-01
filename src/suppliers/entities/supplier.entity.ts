import { Article } from "src/article/entities/article.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('suppliersmediakit')
export class Supplier {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    nombre: string;

    @Column({ type: 'text' })
    descripcion: string;

    @Column({ nullable: true })
    imagen: string;

    @OneToMany(() => Article, (articulo) => articulo.supplier)
    articulos: Article[];
}
