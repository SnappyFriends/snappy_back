
import { Report } from 'src/reports/entities/report.entity';


import { Poll } from 'src/polls/entities/poll.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Reaction } from 'src/reactions/entities/reaction.entity';

import { Stories } from 'src/stories/entities/stories.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity({
  name: 'Users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({
    nullable: false,
  })
  fullname: string;

  @Column({
    nullable: false,
  })
  username: string;

  @Column({
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    nullable: false,
  })
  registration_date: Date;

  @Column({
    nullable: false,
  })
  last_login_date: Date;

  @Column({
    nullable: false,
  })
  user_type: string;

  @Column({
    nullable: false,
  })
  status: string;

  @Column({
    nullable: false,
  })
  profile_image: string;

  @Column({
    nullable: false,
  })
  location: string;

  @OneToMany(() => Stories, (story) => story.user_id)
  stories: Stories[];


  @OneToMany(() => Report, (report) => report.reported_user)
  reportedReports: Report[];

  @OneToMany(() => Report, (report) => report.reporting_user)
  reportingReports: Report[];


  @OneToMany(() => Poll, (poll) => poll.user)
  polls: Poll[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Reaction, (reaction) => reaction.user)
  reactions: Reaction[];

}
