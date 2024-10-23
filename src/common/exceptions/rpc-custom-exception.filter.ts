import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { Request, Response } from 'express';

//! Leer Contexto de ejecución
// https://docs.nestjs.com/fundamentals/execution-context#host-handler-arguments

//! Exception Filter 
//https://docs.nestjs.com/microservices/exception-filters
@Catch(RpcException)
export class RpcCustomExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  catch(exception: RpcException, host: ArgumentsHost): Observable<Response> {
    const ctx = host.switchToHttp(); //switchToHttp devuelve un objeto HttpArgumentsHost que es apropiado para aplicaciones HTTP
    const request = ctx.getRequest<Request>(); //aqui podemos obtener el request para hacer un log de errores
    //console.log(request)
    const res = ctx.getResponse<Response>();
    const rpcError = exception.getError();

    if (
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      'message' in rpcError
    ) {

      const status = isNaN(+rpcError.status)  ? 400 : +rpcError.status;
      return of(res.status(status).json(rpcError));
    }


    return of( res.status(401).json({
      status: 401,
      message: rpcError,
    }));
  }
}
