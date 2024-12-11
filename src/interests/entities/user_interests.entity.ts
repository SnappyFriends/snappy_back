import { User } from "src/users/entities/user.entity";
import { Entity, ManyToOne } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity({
    name: 'user_interests'
})
export class User_Interests {
    @ManyToOne(() => User, (user) => user.interests)
    user_id: string = uuid();

    @ManyToOne(() => User, (user) => user.stories)
    interest_id: User;
}
