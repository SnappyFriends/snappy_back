import { Column, Entity, OneToMany } from "typeorm";
import { User_Interests } from "./user_interests.entity";

@Entity({
    name: 'interests'
})
export class Interests {
    @OneToMany(() => User_Interests, (interest) => interest.interest_id)
    interest_id: User_Interests[];

    @Column({
        nullable: false
    })
    name: string;
}
