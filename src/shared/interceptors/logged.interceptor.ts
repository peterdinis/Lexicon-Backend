import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, tap } from 'rxjs';
import * as util from 'util';

@Injectable()
export class LoggedInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Convert the Nest ExecutionContext to GraphQL context
    const gqlCtx = GqlExecutionContext.create(context);
    const info = gqlCtx.getInfo();
    const args = gqlCtx.getArgs();

    const operationType = info.operation.operation.toUpperCase(); // QUERY, MUTATION, SUBSCRIPTION
    const fieldName = info.fieldName;
    const variables = args;

    const start = Date.now();
    console.log('----------------------------------');
    console.log(`🚀 GraphQL ${operationType} → ${fieldName}`);
    console.log(`📦 Variables: ${util.inspect(variables, { depth: null, colors: true })}`);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        console.log(`✅ Completed in ${duration}ms`);
        console.log('----------------------------------\n');
      }),
    );
  }
}
