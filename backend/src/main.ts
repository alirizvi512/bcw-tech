import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import rateLimit from "express-rate-limit";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: { origin: true, credentials: true } });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.use(rateLimit({ windowMs: 60_000, max: 60 })); // 60 req/min/IP

    const port = Number(process.env.PORT ?? 3000);
    await app.listen(port);
    console.log(`API listening on :${port}`);
}
bootstrap();
