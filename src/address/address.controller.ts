import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { Address } from './entities/address.entity';

@ApiTags('Address')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Post(':email')
  @UseGuards(AuthGuard)
  create(@Param('email') email: string, @Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(email, createAddressDto);
  }

  @Get(':email')
  @UseGuards(AuthGuard)
  async findOne(@Param('email') email: string): Promise<Address | null> {
    return this.addressService.findOne(email);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: number, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(id, updateAddressDto);
  }
  
}
