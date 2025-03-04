import { PartialType } from '@nestjs/swagger';
import { CreateBuyDto } from './create-buy.dto';

export class UpdateBuyDto extends PartialType(CreateBuyDto) {}
