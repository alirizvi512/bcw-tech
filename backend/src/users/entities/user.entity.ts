// src/users/entities/user.entity.ts
import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index
} from "typeorm";
import { Donation } from "../../donations/entities/donation.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Index({ unique: true })
    @Column({ unique: true })
    wallet!: string;

    // IMPORTANT: nullable column should be typed as string | null (not optional ?)
    @Column({ type: "varchar", nullable: true, default: null })
    email: string | null = null;

    @CreateDateColumn() createdAt!: Date;
    @UpdateDateColumn() updatedAt!: Date;

    @OneToMany(() => Donation, (d) => d.user)
    donations!: Donation[];
}
