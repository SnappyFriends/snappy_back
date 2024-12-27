import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity({
    name: 'Stories'
})
export class Stories {
    @PrimaryGeneratedColumn('uuid')
    story_id: string = uuid();

    @ManyToOne(() => User, (user) => user.stories, {
        nullable: false
    })
    user: User;

    @Column({
        nullable: false
    })
    content: string;

    @Column({
        nullable: true,
    })
    fileUrl: string;

    @CreateDateColumn()
    creation_date: Date;

    @CreateDateColumn()
    expiration_date: Date;
}
