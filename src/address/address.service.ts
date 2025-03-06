import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AddressService {
  
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly userService: UserService,
  ) {}

  async create(email: string, createAddressDto: CreateAddressDto) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const existingAddress = await this.addressRepository.findOne({
      where: { user },
    });

    if (existingAddress) {
      await this.addressRepository.update(existingAddress.id, {
        ...createAddressDto,
        pais: 'España',
      });

      return this.addressRepository.findOne({ where: { id: existingAddress.id } });
    }
    
    const newAddress = this.addressRepository.create({
      ...createAddressDto,
      pais: 'España',
      user,
    });

    return await this.addressRepository.save(newAddress);
  }

  async findOne(email: string): Promise<Address | null> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return await this.addressRepository.findOne({ where: { user } });
  }

  async update(id: number, updateAddressDto: UpdateAddressDto): Promise<Address> {
    const existingAddress = await this.addressRepository.findOne({ where: { id } });

    if (!existingAddress) {
      throw new NotFoundException(`Dirección no encontrada`);
    }

    await this.addressRepository.update(id, updateAddressDto);

    return this.addressRepository.findOne({ where: { id } });
  }
}
