import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import CustomException from './CustomException';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_ERROR';
    let message = 'Internal server error';
    let details = null;

    if (exception instanceof CustomException) {
      status = exception.httpStatus;
      code = exception.code;
      message = exception.message;
      details = exception.details ?? null;
    } else if (exception instanceof HttpException) {
      const responseData = exception.getResponse();
      status = exception.getStatus();
      message = (responseData as any)?.message || exception.message;
      code = 'HTTP_EXCEPTION';
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
    });
  }
}