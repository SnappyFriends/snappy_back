import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Poll } from '../../polls/entities/poll.entity';
import { User } from '../../users/entities/user.entity';

@Entity('poll_responses')
@Index(['user', 'poll'], { unique: true })
export class PollResponse {
  @PrimaryGeneratedColumn('uuid')
  response_id: string;

  @Column('text', { nullable: false })
  selected_option: string;

  @CreateDateColumn()
  response_date: Date;

  @ManyToOne(() => Poll, (poll) => poll.responses, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  poll: Poll;

  @ManyToOne(() => User, (user) => user.responses, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;
}
