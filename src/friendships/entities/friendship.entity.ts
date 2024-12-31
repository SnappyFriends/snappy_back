import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum FriendshipStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  DELETED = 'DELETED',
}

@Entity('friendships')
export class Friendship {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: FriendshipStatus,
    default: FriendshipStatus.PENDING,
  })
  status: FriendshipStatus;

  @CreateDateColumn()
  request_date: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id_1' })
  user1: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id_2' })
  user2: User;
}
