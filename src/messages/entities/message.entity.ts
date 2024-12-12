import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MessageType } from "../dto/create-message.dto";
import { User } from "src/users/entities/user.entity";
import { Message_Receiver } from "./message_Receiver.entity";


@Entity({
    name: 'Messages'
})
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "varchar", length: 50, nullable: false })
    content: string;

    @Column({ type: Date })
    send_date: Date;

    @Column({ type: "boolean" })
    is_anonymous: boolean;

    @Column({
        type: 'enum',
        enum: MessageType,
        default: MessageType.TEXT
    })
    type: MessageType

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({
        name: 'User_Id'
    })
    user: User

    @OneToMany(() => Message_Receiver, (messageReceiver) => messageReceiver.message_id)
    messageReceivers: Message_Receiver[]

}
