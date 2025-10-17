import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    Index,
    CreateDateColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Donation {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => User, (u) => u.donations, { eager: true })
    user!: User;

    @Index()
    @Column()
    txHash!: string;

    @Column({ type: "numeric", precision: 78, scale: 0 })
    amountWei!: string;

    @Column({ type: "numeric", precision: 78, scale: 0, default: 0 })
    amountInUSD!: string;

    @Column({ type: "numeric", precision: 78, scale: 0, nullable: true })
    ethUsdPriceAtDonation!: string | null;

    @Column({ type: "int", nullable: true })
    ethUsdPriceDecimals!: number | null;

    @Column({ default: "ETH" })
    tokenSymbol!: string;

    @Column({ default: "sepolia" })
    network!: string;

    @Column({ default: false })
    confirmed!: boolean;

    @CreateDateColumn()
    createdAt!: Date;
}
