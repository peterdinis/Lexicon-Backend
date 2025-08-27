import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { clerkClient } from '@clerk/express';
import { ClerkAuthService } from '../auth.service';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private readonly clerkAuth: ClerkAuthService) {}

  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context).getContext();
    const token = ctx.req.headers.authorization?.replace('Bearer ', '');
    if (!token) return false;

    try {
      // Provide token as second argument
      const session = await clerkClient.sessions.verifySession(token, process.env.CLERK_API_KEY!);
      
      const user = await this.clerkAuth.ensureUser(session.userId);
      ctx.user = user; // attach user to GraphQL context
      return true;
    } catch (err) {
      console.error('Clerk verification failed:', err);
      return false;
    }
  }
}
