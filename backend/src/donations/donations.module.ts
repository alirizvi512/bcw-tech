import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DonationsService } from "./donations.service";
import { DonationsController } from "./donations.controller";
import { Donation } from "./entities/donation.entity";
import { User } from "../users/entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Donation, User])],
    providers: [DonationsService],
    controllers: [DonationsController],
    exports: [DonationsService]
})
export class DonationsModule { }
