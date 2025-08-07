import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { WorkspacesResolver } from "./workspaces.resolver";
import { WorkspacesService } from "./workspaces.service";

@Module({
    imports: [PrismaModule],
    providers: [WorkspacesResolver, WorkspacesService]
})

export class WorkspacesModule {}