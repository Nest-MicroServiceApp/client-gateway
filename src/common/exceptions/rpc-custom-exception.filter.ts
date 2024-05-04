import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

//! Leer Contexto de ejecución
// https://docs.nestjs.com/fundamentals/execution-context#host-handler-arguments

@Catch(RpcException)
export class RpcCustomExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rpcError = exception.getError();

    if (
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      'message' in rpcError
    ) {

      const status = isNaN(+rpcError.status)  ? 400 : +rpcError.status;
      return response.status(status).json(rpcError);
    }


    return response.status(401).json({
      status: 401,
      message: rpcError,
    });
  }
}
