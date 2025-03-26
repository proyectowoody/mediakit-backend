import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discount } from './entities/discount.entity';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private discountRepo: Repository<Discount>,
  ) { }

  async findAll(): Promise<Discount[]> {
    return await this.discountRepo.find();
  }

  async create(dto: CreateDiscountDto): Promise<Discount> {
    const nuevo = this.discountRepo.create(dto);
    return this.discountRepo.save(nuevo);
  }

  async update(id: number, dto: UpdateDiscountDto): Promise<Discount> {
    const descuento = await this.discountRepo.findOneBy({ id });
    if (!descuento) throw new NotFoundException('Descuento no encontrado');
    Object.assign(descuento, dto);
    return this.discountRepo.save(descuento);
  }

  async delete(id: number): Promise<{ message: string }> {
    const result = await this.discountRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Descuento no encontrado');
    return { message: 'Descuento eliminado correctamente' };
  }

  async findByCodigo(codigo: string): Promise<Discount> {
    const descuento = await this.discountRepo.findOne({ where: { codigo } });
    if (!descuento) {
      throw new NotFoundException('Código de descuento inválido');
    }
    return descuento;
  }  

}


