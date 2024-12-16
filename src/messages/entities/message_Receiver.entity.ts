import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Message } from "./message.entity";
import { User } from "src/users/entities/user.entity";

export enum MessageReceiver {
    READ = 'read',
    UNREAD = 'unread',
}

@Entity({
    name: 'Message_Receiver'
})
export class Message_Receiver {
    @PrimaryColumn('uuid')
    @ManyToOne(() => Message, (messages) => messages.messageReceivers)
    @JoinColumn({
        name: 'message_id'
    })
    message_id: Message

    @Column({
        type: 'enum',
        enum: MessageReceiver,
        default: MessageReceiver.READ,
    })
    message_Receiver: MessageReceiver

    @ManyToOne(() => User, (user) => user.userMessageReceivers, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'receiver_id'
    })
    receiver: User


}