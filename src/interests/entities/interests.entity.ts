import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity({
  name: 'interests',
})
export class Interests {
  @PrimaryGeneratedColumn('uuid')
  interest_id: string = uuid();

  @Column({
    nullable: false,
  })
  name: string;
}
