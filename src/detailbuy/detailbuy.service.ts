import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Detailbuy } from './entities/detailbuy.entity';

@Injectable()
export class DetailbuyService {
  constructor(
    @InjectRepository(Detailbuy)
    private readonly detailbuyRepository: Repository<Detailbuy>,
  ) {}

  async create(buyId: number, articleIds: number[]): Promise<void> {
    const detailBuys = articleIds.map(articleId => {
      return this.detailbuyRepository.create({
        buy: { id: buyId }, 
        article: { id: articleId },
      });
    });

    await this.detailbuyRepository.save(detailBuys);
  }
}
