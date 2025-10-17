// src/common/email.service.ts
import { Injectable, Logger } from "@nestjs/common";
import nodemailer from "nodemailer";
@Injectable()
export class EmailService {
    private readonly log = new Logger(EmailService.name);
    async sendEmailToWinner(to: string, amountEth: string) {
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
        const mail = await transporter.sendMail({
            to, from: "no-reply@ngo.example", subject: "You won the weekly draw!",
            text: `Congrats! You'll receive 2x your donation (${amountEth} ETH).`
        });
        this.log.log(`email queued: ${JSON.stringify(mail.messageId)}`);
    }
}
