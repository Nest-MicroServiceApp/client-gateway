import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.First.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
