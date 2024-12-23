import { IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { Permissions } from '../entities/privacy.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePrivacyDto {
  @ApiProperty({
    enum: Permissions,
    description: 'Comment permissions',
    example: Permissions.EVERYONE
  })
  @IsEnum(Permissions)
  @IsOptional()
  comment_permissions?: Permissions;


  @ApiProperty({
    enum: Permissions,
    description: 'Anonymous message permissions',
    example: Permissions.EVERYONE
  })
  @IsEnum(Permissions)
  @IsOptional()
  anonymous_message_permissions?: Permissions;

  @ApiProperty({
    type: Boolean,
    description: 'enable seen receipt',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  enable_seen_receipt?: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'recommend users',
    example: true
  })
  @IsBoolean()
  @IsOptional()
  recommend_users?: boolean;
}
