// common/pipes/graphql-validation.pipe.ts
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  ValidationPipe,
} from '@nestjs/common';
import { GraphQLError } from 'graphql';

@Injectable()
export class GraphQLValidationPipe implements PipeTransform {
  private readonly validationPipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      return new GraphQLError(
        'Validation error',
        {
          extensions: {
            code: 'GRAPHQL_VALIDATION_FAILED',
            errors: errors.map((error) => ({
              field: error.property,
              constraints: error.constraints,
            })),
          },
        }
      );
    },
  });

  async transform(value: any, metadata: ArgumentMetadata) {
    return this.validationPipe.transform(value, metadata);
  }
}
