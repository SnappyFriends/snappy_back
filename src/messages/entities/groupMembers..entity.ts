import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Chat_Groups } from "./chatGroup.entity";
import { User } from "src/users/entities/user.entity";

export enum Role {
    ADMIN = 'admin',
    MEMBER = 'member'
}

@Entity({
    name: 'Group_Members'
})

export class Group_Members {

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.MEMBER
    })
    role: Role;

    @Column({ type: 'date' })
    join_date: Date;

    @PrimaryColumn()
    @ManyToOne(() => Chat_Groups, (chatgroup) => chatgroup.members)
    @JoinColumn({
        name: 'group_id'
    })
    group: Chat_Groups;

    @ManyToOne(() => User, (user) => user.groupMembers, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'user_id'
    })
    user: User;

}