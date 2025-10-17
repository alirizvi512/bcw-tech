import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeormConfig = (): TypeOrmModuleOptions => ({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [__dirname + "/../**/*.entity.{ts,js}"],
    synchronize: true, // DEV only; replace with migrations in prod
    logging: false
});
