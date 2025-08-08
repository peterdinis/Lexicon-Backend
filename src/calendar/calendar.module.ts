import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { CalendarResolver } from "./calendar.resolver";
import { CalendarService } from "./calendar.service";

@Module({
    imports: [PrismaModule],
    providers: [CalendarResolver, CalendarService]
})

export class CalendarModule {}