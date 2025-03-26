import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Res } from '@nestjs/common';
import { DatauserService } from './datauser.service';
import { CreateDatauserDto } from './dto/create-datauser.dto';
import { UpdateDatauserDto } from './dto/update-datauser.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/user/guard/auth.guard';

@ApiTags('DataUser')
@Controller('datauser')
export class DatauserController {
  constructor(private readonly datauserService: DatauserService) { }

  @Post()
  @UseGuards(AuthGuard)
  create(@Request() req, @Body() createDatauserDto: CreateDatauserDto) {
    const email = req.user.email;
    return this.datauserService.create(email, createDatauserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.datauserService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.datauserService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateDatauserDto: UpdateDatauserDto) {
    return this.datauserService.update(+id, updateDatauserDto);
  }

  @Delete()
  @UseGuards(AuthGuard)
  remove(@Request() req) {
    const email = req.user.email;
    this.datauserService.remove(email);
  }

}
