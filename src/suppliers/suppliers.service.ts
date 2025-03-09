import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { CloudinaryService } from 'src/cloudinay/cloudinay.service';
import { Repository } from 'typeorm';

@Injectable()
export class SuppliersService {

   constructor(
      @InjectRepository(Supplier)
      private readonly supplierRepository: Repository<Supplier>,
      private cloudinaryService: CloudinaryService,
    ) { }
  
    async create(supplier: CreateSupplierDto) {
  
      const supplierFound = await this.supplierRepository.findOne({
        where: { nombre: supplier.nombre },
      });
  
      if (supplierFound) {
        throw new HttpException('El proveedor ya existe.', HttpStatus.CONFLICT);
      }
  
      const uploadResult = await this.cloudinaryService.uploadFile(
        supplier.imagen,
      );
  
      if (!uploadResult) {
        throw new HttpException(
          'Error al subir la imagen.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
  
      const imageUrl = uploadResult.secure_url;
  
      const newCategoria = this.supplierRepository.create({
        ...supplier,
        imagen: imageUrl,
      });
  
      await this.supplierRepository.save(newCategoria);
  
      return {
        message: 'Proveedor creada con éxito',
      };
    }
  
    async findAll(): Promise<Supplier[]> {
      return this.supplierRepository.find();
    }
  
    async findOne(id: number): Promise<{ message: string; supplier: Supplier }> {
      const supplier = await this.supplierRepository.findOne({ where: { id } });
      if (!supplier) {
        throw new NotFoundException(`Proveedor no encontrada.`);
      }
      return {
        message: 'Proveedor recuperada con éxito',
        supplier,
      };
    }
  
    async update(
      id: number,
      updateSupplierDto: UpdateSupplierDto,
    ): Promise<{ message: string; supplier: Supplier }> {
      try {
        const supplier = await this.supplierRepository.preload({
          id,
          ...updateSupplierDto,
        });
    
        if (!supplier) {
          throw new NotFoundException(`Proveedor no encontrado.`);
        }
    
        const updatedSupplier = await this.supplierRepository.save(supplier);
    
        return {
          message: 'Proveedor actualizado con éxito',
          supplier: updatedSupplier,
        };
      } catch (error) {
        throw new InternalServerErrorException(
          `Error al actualizar el proveedor: ${error.message}`,
        );
      }
    }    
  
    private extractPublicId(imageUrl: string): string | null {
      const regex = /\/([^\/]+)\.\w+$/;
      const match = imageUrl.match(regex);
      return match ? match[1] : null;
    }
  
    async updateImagen(
      id: any,
      imagen: Express.Multer.File,
    ): Promise<{ message: string; supplier: Supplier }> {
      const supplier = await this.supplierRepository.findOne({ where: { id } });
  
      if (!supplier) {
        throw new NotFoundException(`Categoria no encontrado`);
      }
  
      const currentImageUrl = supplier.imagen;
      if (currentImageUrl) {
        const publicId = this.extractPublicId(currentImageUrl);
        if (publicId) {
          await this.cloudinaryService.deleteFile(publicId);
        }
      }
  
      const uploadResult = await this.cloudinaryService.uploadFile(imagen);
  
      supplier.imagen = uploadResult.secure_url;
  
      const updatedCategory = await this.supplierRepository.save(supplier);
  
      return {
        message: 'Imagen actualizada con éxito',
        supplier: updatedCategory,
      };
    }
  
    async remove(id: any): Promise<{ message: string }> {
      const supplier = await this.supplierRepository.findOne({ where: { id } });
  
      if (!supplier) {
        throw new NotFoundException(`Proveedor no encontrado`);
      }
  
      const imageUrl = supplier.imagen;
      const publicId = this.extractPublicId(imageUrl);
  
      if (publicId) {
        await this.cloudinaryService.deleteFile(publicId);
      }
  
      await this.supplierRepository.remove(supplier);
  
      return { message: 'Proveedor eliminado con éxito' };
    }

}
