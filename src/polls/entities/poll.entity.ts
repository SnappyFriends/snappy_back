import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PollResponse } from '../../polls/pollResponse.entity';

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

  @Column({ type: 'timestamp', nullable: true })
  closing_date: Date;

  @OneToMany(() => PollResponse, (pollResponse) => pollResponse.poll)
  responses: PollResponse[];

  @ManyToOne(() => User, (user) => user.polls, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;
}
