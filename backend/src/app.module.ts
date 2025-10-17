import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleModule } from "@nestjs/schedule";
import { typeormConfig } from "./config/typeorm.config";
import { DonationsModule } from "./donations/donations.module";
import { UsersModule } from "./users/users.module";
import { WinnersModule } from "./winners/winners.module";
import { JobsModule } from "./jobs/jobs.module";
import { HealthController } from "./common/health.controller";
import { EmailService } from "./common/email.service";
import { EmailModule } from "./common/email.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({ useFactory: typeormConfig }),
        ScheduleModule.forRoot(),
        DonationsModule,
        UsersModule,
        WinnersModule,
        JobsModule,
        EmailModule
    ],
    controllers: [HealthController]
})
export class AppModule { }
