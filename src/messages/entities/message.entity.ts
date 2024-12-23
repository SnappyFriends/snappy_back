import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MessageType } from '../dto/create-message.dto';
import { User } from 'src/users/entities/user.entity';
import { Message_Receiver } from './message_Receiver.entity';

@Entity({
  name: 'Messages',
})
export class Message {
  @PrimaryGeneratedColumn('uuid')
  message_id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  content: string;

  @CreateDateColumn()
  send_date: Date;

  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXT,
    nullable: false,
  })
  type: MessageType;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sender_Id' })
  sender_id: User;

  @Column({ type: 'boolean' })
  is_anonymous: boolean;

  @OneToMany(
    () => Message_Receiver,
    (messageReceiver) => messageReceiver.message_id,
  )
  messageReceivers: Message_Receiver[];
}
