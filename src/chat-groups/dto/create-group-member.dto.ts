import { IsUUID, IsNotEmpty, IsEnum } from 'class-validator';
import { Role } from '../entities/groupMembers.entity';

export class CreateGroupMemberDto {
  @IsUUID()
  @IsNotEmpty()
  group_id: string;

  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsEnum(Role)
  role?: Role;
}
