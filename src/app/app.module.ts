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
import { CalendarModule } from 'src/calendar/calendar.module';
import { AppModelResolver } from './app.resolver';
import { TemplatesModule } from 'src/templates/templates.module';
import { PageCollaborationModule } from 'src/page-collaboration/page-collaboration.module';
import { AuthModule } from 'src/auth/auth.module'
import { SearchModule } from 'src/search/search.module';
import { RecentModule } from 'src/recent/recent.module';
import { NotesModule } from 'src/notes/notes.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      installSubscriptionHandlers: true,
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
      context: ({ req, connection }) => {
        if (connection) {
          return { user: connection.context.user };
        }
        return { user: req.user };
      },
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    PagesModule,
    AuthModule,
    WorkspacesModule,
    TasksModule,
    CalendarModule,
    NotificationModule,
    SearchModule,
    TemplatesModule,
    PageCollaborationModule,
    RecentModule,
    NotesModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggedInterceptor,
    },
    AppModelResolver,
  ],
})
export class AppModule { }
