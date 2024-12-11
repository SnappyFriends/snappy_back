import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';

@Entity('reactions')
@Index(['user', 'post'], { unique: true })
export class Reaction {
  @PrimaryGeneratedColumn('uuid')
  reaction_id: string;

  @Column({
    type: 'enum',
    enum: ['like', 'dislike'],
    nullable: false,
  })
  reaction_type: 'like' | 'dislike';

  @CreateDateColumn()
  reaction_date: Date;

  @ManyToOne(() => Post, (post) => post.reactions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  post: Post;

  @ManyToOne(() => User, (user) => user.reactions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;
}
