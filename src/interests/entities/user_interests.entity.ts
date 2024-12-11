import { User } from 'src/users/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Interests } from './interests.entity';

@Entity({
  name: 'user_interests',
})
export class User_Interests {
  @PrimaryColumn('uuid')
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user_id: User;

  @ManyToOne(() => Interests, (interest) => interest.interest_id)
  interest_id: Interests;
}
