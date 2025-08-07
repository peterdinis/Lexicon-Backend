import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggedInterceptor implements NestInterceptor {
  private readonly logger = new Logger('GraphQL');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlCtx = GqlExecutionContext.create(context);
    const info = gqlCtx.getInfo();
    const variables = gqlCtx.getArgs();
    const user = gqlCtx.getContext()?.req?.user; // if using auth

    const operation = info.operation.operation;
    const operationName = info.fieldName;

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `${operation.toUpperCase()} "${operationName}" ${
            user ? `by ${user.email || user.id}` : ''
          } - ${Date.now() - now}ms`
        );
      })
    );
  }
}
