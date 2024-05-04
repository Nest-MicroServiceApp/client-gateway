import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, Query } from '@nestjs/common';
import { UpdateOrderDto,CreateOrderDto } from './dto';
import { ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from '../common';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { StatusDto } from './dto/status.dto';

@Controller('orders')
export class OrdersController {
  //*ClienteProxy:
  //*Permite crear una clase personalizada para comunicarse con un servicio 
  //*externo/emitir y publicar mensajes (o eventos)
  constructor(
    @Inject(ORDER_SERVICE) private readonly odersClient: ClientProxy

  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.odersClient.send('createOrder',createOrderDto)
    .pipe(
      catchError(err => { throw new RpcException(err)})
    )
  }

  @Get()
  findAllOrders(@Query() oderPaginationDto:OrderPaginationDto) {
    return this.odersClient.send('findAllOrders',oderPaginationDto)
    .pipe(
      catchError(err => { throw new RpcException(err)})
    )
  }

  @Get(':id')
  findOneOrder(@Param('id', ParseIntPipe) id: number) {
    return this.odersClient.send('findOneOrder',{id})
    .pipe(
      catchError(err => { throw new RpcException(err)})
    )
  }

  // @Patch(':id')
  // updateOrder(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.odersClient.send('updateOrder',{updateOrderDto})
  //   .pipe(
  //     catchError(err => { throw new RpcException(err)})
  //   )
  // }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.odersClient.send('removeOrder',{id})
    .pipe(
      catchError(err => { throw new RpcException(err)})
    )
  }

  @Patch(':id')
  changeOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusDto : StatusDto
  ) {

    
      return this.odersClient.send('changeOrderStatus',{id, status:statusDto.status})
      .pipe(
        catchError(err => { throw new RpcException(err)})
      )
   
   
  }
  
}
