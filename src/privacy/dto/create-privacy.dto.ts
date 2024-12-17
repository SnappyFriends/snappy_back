import { IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { Permissions } from '../entities/privacy.entity';

export class CreatePrivacyDto {
  @IsEnum(Permissions)
  @IsOptional()
  comment_permissions?: Permissions;

  @IsEnum(Permissions)
  @IsOptional()
  anonymous_message_permissions?: Permissions;

  @IsBoolean()
  @IsOptional()
  enable_seen_receipt?: boolean;

  @IsBoolean()
  @IsOptional()
  recommend_users?: boolean;
}
