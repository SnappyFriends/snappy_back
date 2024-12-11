import { Report } from "src/reports/entities/report.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


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

    @ManyToOne(() => User)
    @JoinColumn({ name: 'User_id' })
    user: User

    @ManyToMany(() => Report)
    @JoinTable({
        name: 'Comments_Reports'
    })
    Reports: Report[]


}
