import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Winner } from "./entities/winner.entity";
import { WinnersService } from "./winners.service";
import { User } from "../users/entities/user.entity";
import { Donation } from "../donations/entities/donation.entity";
import { WinnersController } from "./winners.controller";
import { EmailModule } from "../common/email.module";


@Module({
    imports: [TypeOrmModule.forFeature([Winner, User, Donation]), EmailModule],
    providers: [WinnersService],
    exports: [WinnersService],
    controllers: [WinnersController]
})
export class WinnersModule { }
