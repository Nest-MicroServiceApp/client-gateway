import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, ORDER_SERVICE } from '../config';
import { NatsModule } from '../transports/nats.module';

@Module({
  controllers: [OrdersController],
  providers: [],
  imports:[
    //*Conexion a nuestro host y puerto de microservicio, mediante TCP -> conectamos Orders  con Products
    // ClientsModule.register([
    //   {
    //     name: ORDER_SERVICE,
    //     transport: Transport.TCP,
    //     options: {
    //       host :  envs.ordersMicroserviceHost,
    //       port : envs.ordersMicroservicePort
    //     }
    //   }
    // ])

    //*Aqui cambiamos la conexion TCP por NATS. (Conectamos orders-ms -> NATS)
    NatsModule
  ]
})
export class OrdersModule {}
