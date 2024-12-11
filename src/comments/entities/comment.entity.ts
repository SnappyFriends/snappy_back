import { Post } from "src/posts/entities/post.entity";
import { Report } from "src/reports/entities/report.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({
    name: "Comments"
})
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    comment_id: string;

    @Column({ type: "varchar", length: 250 })
    content: string;

    @Column({ type: Date })
    comment_date: Date

    @ManyToOne(() => User, (user) => user.comments, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User

    @ManyToOne(() => Post, (post) => post.comments, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'post_id'
    })
    postComment: Post;


}
