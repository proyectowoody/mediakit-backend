import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
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

  @Post()
  @UseGuards(AuthGuard)
  create(@Request() req, @Body() createAddressDto: CreateAddressDto) {
    const email = req.user.email;
    return this.addressService.create(email, createAddressDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findOne(@Request() req): Promise<Address | null> {
    const email = req.user.email;
    return this.addressService.findOne(email);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: number, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(id, updateAddressDto);
  }

}
