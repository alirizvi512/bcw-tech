import { Module } from "@nestjs/common";
import { WinnersModule } from "../winners/winners.module";
import { RaffleCron } from "./raffle.cron";

@Module({
    imports: [WinnersModule],
    providers: [RaffleCron]
})
export class JobsModule { }
