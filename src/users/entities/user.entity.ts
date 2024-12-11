import { Chat_Groups } from "src/messages/entities/chatGroup.entity";
import { Group_Members } from "src/messages/entities/groupMembers..entity";
import { Message_Receiver } from "src/messages/entities/message_Receiver.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity({
    name: 'Users'
})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuid();

    @Column({
        nullable: false
    })
    fullname: string;

    @Column({
        nullable: false
    })
    username: string

    @Column({
        nullable: false
    })
    email: string

    @Column({
        nullable: false
    })
    password: string

    @Column({
        nullable: false
    })
    registration_date: Date

    @Column({
        nullable: false
    })
    last_login_date: Date

    @Column({
        nullable: false
    })
    user_type: string

    @Column({
        nullable: false
    })
    status: string

    @Column({
        nullable: false
    })
    profile_image: string

    @Column({
        nullable: false
    })
    location: string

    @OneToMany(() => Group_Members, (groupMember) => groupMember.user)
    groupMembers: Group_Members[];

    @OneToMany(() => Chat_Groups, (chatGroup) => chatGroup.creator)
    userChatGroup: Chat_Groups[]

    @OneToMany(() => Message_Receiver, (messageReceiver) => messageReceiver.receiver)
    userMessageReceiver: Message_Receiver[]

}
