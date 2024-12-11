import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from "uuid";

enum StoryType {
    IMAGE = "image",
    VIDEO = "video",
    TEXT = "text"
}

@Entity({
    name: 'Stories'
})
export class Stories {
    @PrimaryGeneratedColumn('uuid')
    story_id: string = uuid();

    @ManyToOne(() => User, (user) => user.stories)
    user_id: User;

    @Column({
        nullable: false
    })
    content: string;

    @CreateDateColumn()
    creation_date: Date;

    @CreateDateColumn()
    expiration_date: Date;

    @Column({
        type: "enum",
        enum: StoryType,
        nullable: false
    })
    type: StoryType
}
