import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { GraphQLValidationPipe } from './shared/pipe/graphql-validation.pipe';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(new GraphQLValidationPipe());
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
