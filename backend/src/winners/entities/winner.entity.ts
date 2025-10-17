import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
    Unique,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Donation } from "../../donations/entities/donation.entity";

@Entity()
@Unique(["user"])
export class Winner {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => User, { eager: true })
    user!: User;

    @ManyToOne(() => Donation, { eager: true })
    donation!: Donation;

    @Column()
    week!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ default: false })
    claimed!: boolean;

    @Column({ type: "numeric", precision: 78, scale: 0, nullable: true })
    rewardAmountWei!: string | null;

    @Column({ default: "pending" })
    rewardStatus!: "pending" | "paid" | "failed";

    @Column({ type: "varchar", length: 66, nullable: true })
    rewardTxHash!: string | null;

    @Column({ type: "text", nullable: true })
    rewardError!: string | null;
}
