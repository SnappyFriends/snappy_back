import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
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
}
