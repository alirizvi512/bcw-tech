import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>
    ) { }

    async findById(id: string) {
        return this.users.findOne({ where: { id } });
    }

    async findByWallet(wallet: string) {
        // wallet should already be checksum-normalized by the caller if needed
        return this.users.findOne({ where: { wallet } });
    }

    async upsertByWallet(wallet: string, email?: string | null) {
        let user = await this.findByWallet(wallet);
        if (!user) {
            user = this.users.create({ wallet, email: email ?? null });
            return this.users.save(user);
        }
        if (email && email !== user.email) {
            user.email = email;
            return this.users.save(user);
        }
        return user;
    }

    async list(limit = 50, offset = 0) {
        return this.users.find({
            take: limit,
            skip: offset,
            order: { createdAt: "DESC" }
        });
    }
}
