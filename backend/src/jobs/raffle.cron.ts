import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { WinnersService } from "../winners/winners.service";

@Injectable()
export class RaffleCron {
    private readonly logger = new Logger(RaffleCron.name);
    constructor(private readonly winners: WinnersService) { }

    // Run weekly on Monday 00:00 UTC (adjust as needed)
    @Cron(CronExpression.EVERY_5_MINUTES)
    async weekly() {
        this.logger.log("Running weekly draw...");
        const res = await this.winners.runWeeklyDraw();
        this.logger.log(`Weekly draw result: ${JSON.stringify(res)}`);
    }
}
