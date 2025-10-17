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

    @Column({ type: "varchar", nullable: true, default: null })
    email: string | null = null;

    @CreateDateColumn() createdAt!: Date;
    @UpdateDateColumn() updatedAt!: Date;

    @OneToMany(() => Donation, (d) => d.user)
    donations!: Donation[];
}
