import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PollResponse } from '../../poll-response/entities/poll-response.entity';

@Entity('polls')
export class Poll {
  @PrimaryGeneratedColumn('uuid')
  poll_id: string;

  @Column('text', { nullable: false })
  content: string;

  @CreateDateColumn()
  creation_date: Date;

  @Column({
    type: 'enum',
    enum: ['group', 'post'],
    nullable: false,
  })
  type: 'group' | 'post';

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP + INTERVAL 7 DAY',
  })
  closing_date: Date;

  @Column('text', { array: true, nullable: false })
  options: string[];

  @OneToMany(() => PollResponse, (pollResponse) => pollResponse.poll)
  responses: PollResponse[];

  @ManyToOne(() => User, (user) => user.polls, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;
}
