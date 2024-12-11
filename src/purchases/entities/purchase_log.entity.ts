import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from "uuid";

enum Membership {
    REGULAR = "regular",
    PREMIUM = "premium"
}

enum PaymentMethod {
    CREDIT_CARD = "credit_card",
    PAYPAL = "paypal",
    BANK_TRANSFER = "bank_transfer"
}

enum PaymentStatus {
    COMPLETED = "completed",
    FAILED = "failed",
    PENDING = "pending"
}

@Entity({
    name: 'purchase_log'
})
export class Purchase_Log {
    @PrimaryGeneratedColumn('uuid')
    purchase_id: string = uuid();

    @ManyToOne(() => User, (user) => user.purchases)
    user_id: User;

    @Column({
        type: "enum",
        enum: Membership,
        nullable: false
    })
    membership_type: Membership

    @CreateDateColumn()
    purchase_date: Date

    @CreateDateColumn()
    expiration_date: Date

    @Column('numeric', {
        nullable: false,
        precision: 10,
        scale: 2
    })
    amount: number

    @Column({
        type: "enum",
        enum: PaymentMethod,
        nullable: false
    })
    payment_method: PaymentMethod

    @Column({
        type: "enum",
        enum: PaymentStatus,
        nullable: false
    })
    status: PaymentStatus
}
