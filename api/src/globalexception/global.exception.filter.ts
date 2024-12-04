import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  UnauthorizedException,
} from "@nestjs/common";
import {
  QueryFailedError,
  EntityNotFoundError,
  CannotCreateEntityIdMapError,
} from "typeorm";

@Catch() // este decorador captura una excepcion,
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR; // si el status es internal server error no entra en el switch y devuelve directamente
    let message = "Internal Server Error";
    let code;

    // Utilizamos un switch para manejar diferentes tipos de excepciones
    switch (true) {
    
      // Manejo de excepciones de tipo HttpException
      case exception instanceof HttpException:
        status = exception.getStatus();
        message = exception.message;
        break;
      // Manejo de excepciones de tipo QueryFailedError (TypeORM)
      case exception instanceof QueryFailedError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = exception.message;
        code = (exception as any).code;
        break;
      // Manejo de excepciones de tipo EntityNotFoundError y CannotCreateEntityIdMapError (TypeORM)
      case exception instanceof EntityNotFoundError:
        status = HttpStatus.NOT_FOUND;
        message = exception.message;
        code = (exception as any).code;
        break;
      case exception instanceof UnauthorizedException:
        status = HttpStatus.UNAUTHORIZED;
        message = exception.message;
        break;
      case exception instanceof CannotCreateEntityIdMapError://guardar una entidad que ya tiene un ID asignado
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = exception.message;
        code = (exception as any).code;
        break;
      default:
        break;
    }
    console.error({
      errorType: exception.constructor.name,
      errorMessage: exception.message,
      stackTrace: exception.stack,
      statusCode: status,
      requestPath: request.url,
      errorCode: code,
    });
    // Respondemos con el código de estado, mensaje y, opcionalmente, el código de error
    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
      code: code,
    });
  }
}
