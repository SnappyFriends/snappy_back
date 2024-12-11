import { User } from "src/users/entities/user.entity";
import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Interests } from "./interests.entity";

@Entity({
    name: 'user_interests'
})
export class User_Interests {
    @PrimaryColumn()
    @ManyToOne(() => User, (user) => user.interests)
    user_id: User;

    @ManyToOne(() => Interests, (interest) => interest.interest_id)
    interest_id: Interests;
}
