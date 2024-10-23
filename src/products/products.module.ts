import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { NatsModule } from '../transports/nats.module';
 import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, NATS_SERVICE, PRODUCT_SERVICE } from 'src/config';

@Module({
  controllers: [ProductsController],
  providers: [],
  imports: [ 
    //*Conexion a nuestro host y puerto de microservicio, mediante TCP -> conectamos Products con Orders
    ClientsModule.register([
      {
        name:PRODUCT_SERVICE, 
        transport: Transport.TCP,
        options : {
          host : envs.productsMicroserviceHost,
          port:  envs.productsMicroservicePort
        }
      }
    ])

    //*Aqui cambiamos la conexion TCP por NATS. (Conectamos product-ms -> NATS)
    //*Pero este modulo lo pasaramos a un modulo comun NATS, para poder importarlo en todos los modulos que lo necesitamos
    //NatsModule

    // ClientsModule.register([
    //   {
    //     name:NATS_SERVICE, 
    //     transport: Transport.NATS,
    //     options : {
    //       servers: envs.natsServers
    //     }
    //   }
    // ])
   ]
})
export class ProductsModule {}
