import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PagesModule } from 'src/pages/pages.module';
import { WorkspacesModule } from 'src/workspaces/workspaces.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { LoggedInterceptor } from 'src/shared/interceptors/logged.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      graphiql: true,
      installSubscriptionHandlers: true,
       context: ({ req, connection }) => {
        if (connection) {
          // Subscriptions context
          return { user: connection.context.user };
        }
        // HTTP request context
        return { user: req.user };
      },
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    PagesModule,
    WorkspacesModule,
    TasksModule,
    NotificationModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggedInterceptor,
    }
  ]
})
export class AppModule { }
