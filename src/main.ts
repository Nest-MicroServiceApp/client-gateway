import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { RpcCustomExceptionFilter } from './common';

async function bootstrap() {

  const logger = new Logger('Main ApiGateway')
  
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api') //Esto es para que todos los endpoint empicen con la palabra "api"
  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
   );

   //*Aqui configuramos como un un filtro global nuestra instancia de RpcCustomExceptionFilter, para que podamos usarlo en todos nuestras modulos
   app.useGlobalFilters(new RpcCustomExceptionFilter())
   
   //*setGlobalPrefix : para que nuestros endpoint empiecen www.dominio.com/api/...
  await app.listen(envs.port);

  logger.log(`Gateway corriendo en el puerto ${envs.port}`)
}
bootstrap();
