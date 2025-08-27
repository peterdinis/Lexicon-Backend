import { Module } from "@nestjs/common";
import { ClerkAuthGuard } from "./guard/clerk-auth.guard";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthService } from "./auth.service";

@Module({
    imports: [PrismaModule],
    providers: [AuthService, ClerkAuthGuard],
})

export class AuthModule {}