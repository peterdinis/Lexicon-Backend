import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { NotesResolver } from "./notes.resolver";
import { NotesService } from "./notes.service";

@Module({
    imports: [PrismaModule],
    providers: [NotesService, NotesResolver]
})

export class NotesModule {}