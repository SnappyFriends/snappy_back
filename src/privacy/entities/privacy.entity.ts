import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum Permissions {
  EVERYONE = 'everyone',
  FRIENDS = 'friends',
  NO_ONE = 'no_one',
}

@Entity()
export class Privacy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: Permissions,
    default: Permissions.EVERYONE,
  })
  comment_permissions: Permissions;

  @Column({
    type: 'enum',
    enum: Permissions,
    default: Permissions.EVERYONE,
  })
  anonymous_message_permissions: Permissions;

  @Column({ type: 'boolean', default: false })
  enable_seen_receipt: boolean;

  @Column({ type: 'boolean', default: true })
  recommend_users: boolean;

  @ManyToOne(() => User, (user) => user.privacy)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
