import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Datauser } from './entities/datauser.entity';
import { CreateDatauserDto } from './dto/create-datauser.dto';
import { UpdateDatauserDto } from './dto/update-datauser.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class DatauserService {
  constructor(
    @InjectRepository(Datauser)
    private readonly datauserRepo: Repository<Datauser>,
    private readonly userService: UserService
  ) { }

  async create(email: string, dto: CreateDatauserDto): Promise<Datauser> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado.');
    }

    const nuevo = this.datauserRepo.create({
      ...dto,
      user: user,
    });

    return this.datauserRepo.save(nuevo);
  }

  async findAll(): Promise<Datauser[]> {
    return this.datauserRepo.createQueryBuilder('datauser')
      .leftJoinAndSelect('datauser.user', 'user')
      .select([
        'datauser',
        'user.name',
        'user.lastName',
      ])
      .getMany();
  }

  async findOne(id: number): Promise<Datauser> {
    const data = await this.datauserRepo.findOneBy({ id });
    if (!data) throw new NotFoundException('Datos no encontrados');
    return data;
  }

  async update(id: number, dto: UpdateDatauserDto): Promise<Datauser> {
    const user = await this.findOne(id);
    const updated = Object.assign(user, dto);
    return this.datauserRepo.save(updated);
  }

  async remove(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado.');
    }
    const userId = user.id;
    await this.userService.deleteUserById(userId);
  }
  
}
