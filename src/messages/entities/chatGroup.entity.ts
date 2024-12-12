import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from 'uuid';

export enum Privacy {
    PUBLIC = 'public',
    PRIVATE = 'private',
}

@Entity({
    name: 'Chat_Groups'
})
export class Chat_Groups {
    @PrimaryGeneratedColumn('uuid')
    group_id: string = uuid();

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

    @ManyToOne(() => User, (user) => user.userChatGroup, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'creator_id'
    })
    creator: User
}