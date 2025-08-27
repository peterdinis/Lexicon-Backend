import { Module } from "@nestjs/common";
import { ClerkAuthService } from "./auth.service";
import { ClerkAuthGuard } from "./guard/clerk-auth.guard";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    providers: [ClerkAuthService, ClerkAuthGuard],
})

export class AuthModule {}