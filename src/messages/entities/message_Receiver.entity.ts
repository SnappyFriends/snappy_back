import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { MessageReceiver } from "../dto/create-message.dto";
import { Message } from "./message.entity";
import { User } from "src/users/entities/user.entity";


@Entity({
    name: 'Message_Receiver'
})

export class Message_Receiver {

    @Column({
        type: 'enum',
        enum: MessageReceiver,
        default: MessageReceiver.READ,
    })
    message_Receiver: MessageReceiver

    @PrimaryColumn()
    @ManyToOne(() => Message, (messages) => messages.messageReceivers)
    @JoinColumn({
        name: 'message_id'
    })
    message: Message

    @ManyToOne(() => User, (user) => user.userMessageReceiver)
    @JoinColumn({
        name: 'receiver_id'
    })
    receiver: User


}