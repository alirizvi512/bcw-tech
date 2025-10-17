// src/email/email.module.ts
import { Module } from "@nestjs/common";
import { join } from "path";
import { EmailService } from "./email.service";

@Module({
    imports: [],
    providers: [EmailService],   // ✅ providers (NOT imports)
    exports: [EmailService],     // ✅ export so other modules can inject it
})
export class EmailModule { }
