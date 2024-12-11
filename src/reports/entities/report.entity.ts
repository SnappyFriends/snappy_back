import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn('uuid')
  report_id: string;

  @Column({ type: 'varchar', length: 100 })
  report_type: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  report_date: Date;

  @ManyToOne(() => User, (user) => user.reportedReports)
  @JoinColumn({ name: 'reported_user_id' })
  reported_user: User;

  @ManyToOne(() => User, (user) => user.reportingReports)
  @JoinColumn({ name: 'reporting_user_id' })
  reporting_user: User;
}
