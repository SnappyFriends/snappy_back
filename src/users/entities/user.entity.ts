import { Reaction } from 'src/reactions/entities/reaction.entity';
import { Privacy } from 'src/privacy/entities/privacy.entity';
import { PollResponse } from 'src/poll-response/entities/poll-response.entity';
import { Report } from 'src/reports/entities/report.entity';
import { Poll } from 'src/polls/entities/poll.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Stories } from 'src/stories/entities/stories.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Purchase_Log } from 'src/purchases/entities/purchase_log.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Chat_Groups } from 'src/chat-groups/entities/chat-group.entity';
import { Group_Members } from 'src/chat-groups/entities/groupMembers.entity';
import { Message_Receiver } from 'src/messages/entities/message_Receiver.entity';
import { Interest } from 'src/interests/entities/interests.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { GroupJoinRequest } from 'src/chat-groups/entities/group-join-request.entity';
import { Chat } from 'src/chat-groups/entities/chat.entity';

export enum userType {
  REGULAR = 'regular',
  PREMIUM = 'premium',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}

export enum userStatus {
  ACTIVE = 'active',
  inactive = 'inactive',
  BANNED = 'banned',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({
    nullable: false,
  })
  fullname: string;

  @Column({
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    nullable: true,
  })
  password: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  birthdate: Date;

  @Column()
  genre: string;

  @Column({
    nullable: true
  })
  description: string;

  @CreateDateColumn()
  registration_date: Date;

  @UpdateDateColumn()
  last_login_date: Date;

  @Column({
    type: 'enum',
    enum: userType,
    nullable: false,
    default: userType.REGULAR,
  })
  user_type: userType;

  @Column({
    type: 'enum',
    enum: userStatus,
    nullable: false,
    default: userStatus.ACTIVE,
  })
  status: userStatus;

  @Column({
    nullable: false,
    default: '/no_img.png',
  })
  profile_image: string;

  @Column({
    nullable: false,
    default: 'no-location',
  })
  location: string;

  @OneToMany(() => Stories, (story) => story.user)
  stories: Stories[];

  @ManyToMany(() => Interest, (interest) => interest.users)
  @JoinTable()
  interests: Interest[];

  @OneToMany(() => Privacy, (privacy) => privacy.user)
  privacy: Privacy[];

  @OneToMany(() => PollResponse, (response) => response.user)
  responses: PollResponse[];

  @OneToMany(() => Report, (report) => report.reported_user)
  reportedReports: Report[];

  @OneToMany(() => Report, (report) => report.reporting_user)
  reportingReports: Report[];

  @OneToMany(() => Poll, (poll) => poll.user)
  polls: Poll[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Purchase_Log, (purchase) => purchase.user)
  purchases: Purchase_Log[];

  @OneToMany(() => Reaction, (reaction) => reaction.user)
  reactions: Reaction[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Group_Members, (groupMember) => groupMember.user)
  groupMembers: Group_Members[];

  @OneToMany(() => Chat_Groups, (chatGroup) => chatGroup.creator)
  createdGroups: Chat_Groups[];

  @OneToMany(
    () => Message_Receiver,
    (messageReceiver) => messageReceiver.receiver_id,
  )
  userMessageReceivers: Message_Receiver[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => GroupJoinRequest, (request) => request.user)
  joinRequests: GroupJoinRequest[];

  @ManyToMany(() => Chat, (chat) => chat.participants)
  @JoinTable({
    name: 'user_chats',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'chat_id', referencedColumnName: 'id' },
  })
  chats: Chat[];
}
