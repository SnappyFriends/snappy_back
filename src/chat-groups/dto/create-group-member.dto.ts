import { IsUUID, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { Role } from '../entities/groupMembers.entity';

export class CreateGroupMemberDto {
  @IsUUID()
  @IsNotEmpty()
  group_id: string;

  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsOptional()
  @IsEnum(Role)
  role: Role;
}
