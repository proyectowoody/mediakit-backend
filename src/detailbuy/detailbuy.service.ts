import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Detailbuy } from './entities/detailbuy.entity';
import { Article } from '../article/entities/article.entity';

@Injectable()
export class DetailbuyService {
  constructor(
    @InjectRepository(Detailbuy)
    private readonly detailbuyRepository: Repository<Detailbuy>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) { }

  async create(buyId: number, articleIds: number[]): Promise<void> {
    const detailBuys = articleIds.map(articleId => {
      return this.detailbuyRepository.create({
        buy: { id: buyId },
        article: { id: articleId },
      });
    });

    await this.detailbuyRepository.save(detailBuys);
  }

  async getTopSellingArticles(limit: number = 10): Promise<any[]> {
    return this.articleRepository
      .createQueryBuilder('article')
      .leftJoin('detailbuymediakit', 'detailbuy', 'detailbuy.articulo_id = article.id')
      .leftJoin('article_images', 'images', 'images.article_id = article.id')
      .select('article.id', 'id')
      .addSelect('article.nombre', 'nombre')
      .addSelect('article.descripcion', 'descripcion')
      .addSelect('article.estado', 'estatus')
      .addSelect('article.precio', 'precio')
      .addSelect('article.discount', 'discount')
      .addSelect('COUNT(detailbuy.articulo_id)', 'total_vendidos')
      .addSelect('GROUP_CONCAT(images.url)', 'imagenes') 
      .groupBy('article.id')
      .having('COUNT(detailbuy.articulo_id) > 0') 
      .orderBy('total_vendidos', 'DESC')
      .limit(limit)
      .getRawMany();
  }  

}

