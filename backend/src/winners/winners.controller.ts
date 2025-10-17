import { Controller, Get } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Winner } from "./entities/winner.entity";
import { Repository } from "typeorm";

@Controller("winners")
export class WinnersController {
    constructor(@InjectRepository(Winner) private winners: Repository<Winner>) { }
    @Get() async recent() {
        return this.winners.find({ take: 10, order: { createdAt: "DESC" } });
    }
}
