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
    message_id: string;

    @PrimaryColumn('uuid')
    receiver_id: string;

    @ManyToOne(() => Message, (messages) => messages.messageReceivers, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'message_id'
    })
    message: Message

    @Column({
        type: 'enum',
        enum: MessageReceiver,
        default: MessageReceiver.UNREAD,
    })
    message_Receiver: MessageReceiver

    @ManyToOne(() => User, (user) => user.userMessageReceivers, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'receiver_id'
    })
    receiver: User


}