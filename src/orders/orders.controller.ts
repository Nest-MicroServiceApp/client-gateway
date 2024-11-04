import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, Query } from '@nestjs/common';
import { UpdateOrderDto,CreateOrderDto } from './dto';
 import { ORDER_SERVICE } from 'src/config';
import { NATS_SERVICE } from 'src/config';

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
    // @Inject(ORDER_SERVICE) private readonly client: ClientProxy
    @Inject(NATS_SERVICE) private readonly client: ClientProxy //*Usando NATS
 

  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder',createOrderDto)
    .pipe(
      catchError(err => { throw new RpcException(err)})
    )
  }

  @Get()
  findAllOrders(@Query() oderPaginationDto:OrderPaginationDto) {
    return this.client.send('findAllOrders',oderPaginationDto)
    .pipe(
      catchError(err => { throw new RpcException(err)})
    )
  }

  @Get('id/:id')
  findOneOrder(@Param('id', ParseIntPipe) id: number) {
    return this.client.send('findOneOrder',{id})
    .pipe(
      catchError(err => { throw new RpcException(err)})
    )
  }

  @Get(':status')
  findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto : PaginationDto
  
  ) {

    return this.client.send('findAllOrders', {
      ...paginationDto,
      status : statusDto
    })
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
    return this.client.send('removeOrder',{id})
    .pipe(
      catchError(err => { throw new RpcException(err)})
    )
  }

  @Patch(':id')
  changeOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusDto : StatusDto
  ) {

    
      return this.client.send('changeOrderStatus',{id, status:statusDto.status})
      .pipe(
        catchError(err => { throw new RpcException(err)})
      )
   
   
  }
  
}
