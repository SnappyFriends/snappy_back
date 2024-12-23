import { IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { Permissions } from '../entities/privacy.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePrivacyDto {
  @ApiProperty({
    enum: ['everyone', 'friends', 'no_one',],
    description: 'Comment permissions',
    example: 'everyone | friends | no_one'
  })
  @IsEnum(Permissions)
  @IsOptional()
  comment_permissions?: Permissions;


  @ApiProperty({
    enum: ['everyone', 'friends', 'no_one',],
    description: 'Anonymous message permissions',
    example: 'everyone | friends | no_one'
  })
  @IsEnum(Permissions)
  @IsOptional()
  anonymous_message_permissions?: Permissions;

  @ApiProperty({
    type: Boolean,
    description: 'enable seen receipt',
    example: 'true | false'
  })
  @IsBoolean()
  @IsOptional()
  enable_seen_receipt?: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'recommend users',
    example: 'true | false'
  })
  @IsBoolean()
  @IsOptional()
  recommend_users?: boolean;
}
