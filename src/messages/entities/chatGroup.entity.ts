import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Group_Members } from "./groupMembers..entity";

export enum Privacy {
    PUBLIC = 'public',
    PRIVATE = 'private',
}

@Entity({
    name: 'Chat_Groups'
})

export class Chat_Groups {

    @PrimaryGeneratedColumn('uuid')
    group_id: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 150, nullable: false })
    description: string;

    @Column({ type: 'date' })
    creation_date: Date;

    @Column({
        type: 'enum',
        enum: Privacy,
        default: Privacy.PUBLIC
    })
    privacy: Privacy

    @ManyToOne(() => User, (user) => user.userChatGroup)
    @JoinColumn({
        name: 'creator_id'
    })
    creator: User

    @OneToMany(() => Group_Members, (member) => member.group)
    members: Group_Members[]

}