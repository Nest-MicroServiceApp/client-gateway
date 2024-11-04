import { PRODUCT_SERVICE } from './../config/serivces';
import { BadRequestException, Body, Controller, Delete, Get, Inject, Logger, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {

  //*ClienteProxy:
  //*Permite crear una clase personalizada para comunicarse con un servicio 
  //*externo/emitir y publicar mensajes (o eventos)
  constructor(
  //@Inject(PRODUCT_SERVICE) private readonly client: ClientProxy //Este es nuestro Proxy que permite conectar con nuestro MS Products
    @Inject(NATS_SERVICE) private readonly client: ClientProxy //*Remplazamos ahora por nuestro servidor NATS

  ) {
  
  } 

  // @Get('/')
  // messagePrueba(){
  //   return 'Hola mundo';
  // }

   //*Como cualquier servicio rest, podemos hacer uso de nuestros Dto's para validar nuestro request
  //*Estos Dto's pueden ser los mismos que tendremos del lado de nuestro microservicio

   //*send : es un metodo que permite enviar una petición y recibir una respuesta, este recibo 2 parametros
      //*patron de mensaje : que sería el nombre tal cual se llamo del lado del microservcio con @MessagePattern
      //*Payload : que sería lo que queremos enviar como request, sea un @Query, @Param o @Body
  @Post()
  createProduct(@Body() createProductDto: CreateProductDto){
    return this.client.send({cmd:'create_product'},createProductDto)
    .pipe(
      catchError(err => {throw new RpcException(err)})
    )
  }

  @Get()
  findAllProduct(@Query() paginationDto:PaginationDto){
    return this.client.send({cmd:'find_all_products'},paginationDto)
    .pipe(
      catchError(err => {throw new RpcException(err)})
    )
  }

  @Get(':id')
  async findOne(@Param('id',ParseIntPipe) id:number){


   //! 1ra forma : 
    // try {
    //   //*rxjs : es una librería que ya viene instalada en nest, y nos permite hacer uso de sus metodos para manejo de observables.
    //   //*firstValueFrom :  espera el primer valor que el observable va a emitir
    //   const product = await firstValueFrom(
    //     this.productsClient.send({cmd:'find_one_product'}, {id})  //esto retorna un observable
    //   );
    //   return product;
    // } catch (error) {
      
    //    //throw new BadRequestException(error);
    //     //* La forma mas recomendada para controlas las excepciones a nivel global es usando un RpcCustomExceptionFilter
    //     //*RpcException va a capturar mi error, y lo enviara a nuestra clase RpcCustomExceptionFilter para  poder retornar un error
    //    throw new RpcException(error);
    // }
    
    //!2da forma 
    return this.client.send({cmd:'find_one_product'}, {id})
      .pipe(
        catchError(err => {throw new RpcException(err)})
      )
  }


  @Delete(':id')
   deleteProduct(  @Param('id') id:string){

    return this.client.send({cmd: 'delet_product'},{id})
    .pipe(
      catchError(err => {throw new RpcException(err)})
    )
  }

  @Patch(':id')
  updatPorudcto(
    @Param('id', ParseIntPipe) id:string, 
    @Body() updatPorudcto: UpdateProductDto
  ){
    return this.client.send({cmd: 'update_product'},{
      id,
      ...updatPorudcto
    })
    .pipe(
      catchError(err => {throw new RpcException(err)})
    )
  }

}
