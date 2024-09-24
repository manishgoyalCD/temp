import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Response } from 'express';
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
  
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Internal server error';
      let stack: string | null = null;
  
      // Check if the exception is an instance of HttpException
      if (exception instanceof HttpException) {
        statusCode = exception.getStatus();
  
        // Extract response from HttpException, which could be a string or object
        const exceptionResponse = exception.getResponse() as
          | string
          | { [key: string]: any };
  
        message =
          typeof exceptionResponse === 'object'
            ? exceptionResponse['message'] || JSON.stringify(exceptionResponse)
            : exceptionResponse;
  
        // Check if stack is available
        stack = exception instanceof Error ? exception.stack : null;
  
      } else if (exception instanceof Error) {
        // Handle generic errors (non-HttpException) and extract stack trace
        message = exception.message;
        stack = exception.stack;
      }
  
      // Build the response with the stack trace included (in development only)
      const errorResponse = {
        statusCode,
        success: false,
        message,
        data: null,
        stackTrace: process.env.NODE_ENV !== 'production' ? stack : undefined, // Include stack trace only in development
      };
  
      // Send the response to the client
      response.status(statusCode).json(errorResponse);
    }
  }
  