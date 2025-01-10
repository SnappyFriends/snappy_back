import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { User } from 'src/users/entities/user.entity';

export enum NotificationType {
  FRIEND_REQUEST = 'friend_request',
  MESSAGE = 'message',
  POST_REACTION = 'post_reaction',
  COMMENT = 'comment',
  GROUP_INVITATION = 'group_invitation',
  SYSTEM = 'system',
  PURCHASE = 'purchase',
}

export enum NotificationStatus {
  READ = 'read',
  UNREAD = 'unread',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  notification_id: string = uuid();

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.UNREAD,
  })
  status: NotificationStatus;

  @CreateDateColumn({ type: 'timestamp' })
  creation_date: Date;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, (user) => user.notification_sender, {
    nullable: true
  })
  @JoinColumn({ name: 'notification_sender' })
  user_sender: User;
}
