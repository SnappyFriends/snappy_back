import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
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
    @PrimaryColumn('uuid')
    @ManyToOne(() => Chat_Groups, (chatgroup) => chatgroup.group_id)
    @JoinColumn({ name: 'group_id' })
    group_id: Chat_Groups;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.MEMBER
    })
    role: Role;

    @Column({ type: 'date' })
    join_date: Date;

    @ManyToOne(() => User, (user) => user.groupMembers, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'user_id'
    })
    user: User;

}