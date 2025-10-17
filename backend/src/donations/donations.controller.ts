import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DonationsService } from "./donations.service";
import { CreateDonationDto } from "./dto/create-donation.dto";

@Controller("donations")
export class DonationsController {
    constructor(private readonly donationService: DonationsService) { }

    @Post()
    async create(@Body() dto: CreateDonationDto) {
        return this.donationService.recordDonation(dto);
    }

    @Get("tx/:txHash")
    async byTx(@Param("txHash") txHash: string) {
        return this.donationService.getByTx(txHash);
    }

    @Get("recent")
    async recent() {
        return this.donationService.recent();
    }
}
