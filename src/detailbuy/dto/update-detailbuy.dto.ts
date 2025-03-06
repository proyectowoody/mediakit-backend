import { PartialType } from '@nestjs/swagger';
import { CreateDetailbuyDto } from './create-detailbuy.dto';

export class UpdateDetailbuyDto extends PartialType(CreateDetailbuyDto) {}
