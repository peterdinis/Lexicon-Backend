import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { clerkClient} from '@clerk/express';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  /**
   * Ensure user exists in DB after Clerk login/signup
   */
  async ensureUser(clerkUserId: string) {
    // Fetch user from Clerk
    const clerkUser = await clerkClient.users.getUser(clerkUserId);

    // Check if user exists in DB
    let user = await this.prisma.user.findUnique({
      where: { email: clerkUser.emailAddresses[0].emailAddress },
    });

    if (!user) {
      // Create user in DB
      user = await this.prisma.user.create({
        data: {
          email: clerkUser.emailAddresses[0].emailAddress,
          name: clerkUser.firstName,
          lastName: clerkUser.lastName,
          photoUrl: clerkUser.imageUrl,
        },
      });
    }

    return user;
  }
}
