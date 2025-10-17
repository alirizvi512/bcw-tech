// src/email/email.module.ts
import { Module } from "@nestjs/common";
import { join } from "path";
import { EmailService } from "./email.service";

@Module({
    imports: [],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule { }
