import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { BlogImage } from './entities/blog-image.entity';
import { CloudinaryService } from 'src/cloudinay/cloudinay.service';

@Injectable()
export class BlogService {

  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(BlogImage)
    private readonly blogImageRepository: Repository<BlogImage>,
    private cloudinaryService: CloudinaryService,
  ) { }

  async findAll() {
    const data = await this.blogRepository.find({
      relations: ['imagenes'],
    });
    return data;
  }

  async createBlog(blog: CreateBlogDto & { imagenes: Express.Multer.File[] }) {

    const blogFound = await this.blogRepository.findOne({
      where: { titulo: blog.titulo },
    });

    if (blogFound) {
      throw new HttpException('El blog ya existe.', HttpStatus.CONFLICT);
    }

    if (!blog.imagenes || blog.imagenes.length === 0) {
      throw new HttpException('No se recibieron imágenes para subir.', HttpStatus.BAD_REQUEST);
    }

    const newBlog = this.blogRepository.create({
      titulo: blog.titulo,
      descripcion: blog.descripcion,
      slug: blog.slug,
      categoria: blog.categoria,
      contenido: blog.contenido
    });

    await this.blogRepository.save(newBlog);
    const uploadedImages = [];

    for (const imagen of blog.imagenes) {
      const uploadResult = await this.cloudinaryService.uploadFile(imagen);
      if (!uploadResult) {
        throw new HttpException(
          'Error al subir la imagen.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const newImage = this.blogImageRepository.create({
        url: uploadResult.secure_url,
        blog: newBlog
      });

      const savedImage = await this.blogImageRepository.save(newImage);
      uploadedImages.push(savedImage);
    }

    return {
      message: 'Blog creado con éxito',
      blog: {
        ...newBlog,
        imagenes: uploadedImages,
      },
    };
  }

  async updateBlog(
    id: any,
    updateBlog: UpdateBlogDto,
  ) {
    try {
      const blog = await this.blogRepository.findOne({ where: { id } });

      if (!blog) {
        throw new NotFoundException(`Blog no encontrado`);
      }
      const updatedBlog = Object.assign(blog, updateBlog);
      await this.blogRepository.save(updatedBlog);

      return {
        message: 'Blog actualizado correctamente',
        articulo: updatedBlog,
      };

    } catch (error) {
      throw new Error('No se pudo actualizar el blog');
    }
  }

  async updateImagen(id: any, imagen: Express.Multer.File[]) {
    try {

      const blog = await this.blogRepository.findOne({
        where: { id },
        relations: ['imagenes'],
      });

      if (!blog) {
        throw new NotFoundException(`Blog no encontrado`);
      }

      if (imagen && imagen.length > 0) {
        for (const imagenFile of imagen) {
          const uploadResult = await this.cloudinaryService.uploadFile(imagenFile);

          const nuevaImagen = this.blogImageRepository.create({
            url: uploadResult.secure_url,
            blog: blog,
          });

          await this.blogImageRepository.save(nuevaImagen);
        }
      }
      return;
    } catch (error) {
      throw new Error('No se pudo actualizar la imagen');
    }
  }

  async deleteBlog(id: any): Promise<{ message: string }> {
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: ['imagenes'],
    });

    if (!blog) {
      throw new NotFoundException(`Artículo no encontrado`);
    }

    for (const imagen of blog.imagenes) {
      const publicId = this.extractPublicId(imagen.url);
      if (publicId) {
        try {
          await this.cloudinaryService.deleteFile(publicId);
        } catch (error) {
          console.error(`Error al eliminar la imagen`, error);
        }
      }
    }

    await this.blogRepository.remove(blog);

    return { message: 'Artículo e imágenes eliminados con éxito' };
  }

  async deleteBlogImage(imageUrl: string) {

    const image = await this.blogImageRepository.findOne({
      where: { url: imageUrl },
    });

    if (!image) {
      throw new NotFoundException('La imagen no existe en la base de datos');
    }

    const publicId = this.extractPublicId(image.url);

    if (publicId) {
      try {
        await this.cloudinaryService.deleteFile(publicId);
      } catch (error) {
        console.error(`Error al eliminar la imagen en Cloudinary`, error);
        throw new HttpException(
          'Error al eliminar la imagen en Cloudinary',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }

    await this.blogImageRepository.delete(image.id);

  }

  private extractPublicId(imageUrl: string): string | null {
    const regex = /\/([^\/]+)\.\w+$/;
    const match = imageUrl.match(regex);
    return match ? match[1] : null;
  }
}
