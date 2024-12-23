import { PartialType } from '@nestjs/mapped-types';
import { CreatePrivacyDto } from './create-privacy.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Permissions } from '../entities/privacy.entity';

export class UpdatePrivacyDto extends PartialType(CreatePrivacyDto) {
    @ApiPropertyOptional({
        enum: ['everyone', 'friends', 'no_one'],
        description: 'Comment permissions',
        example: 'everyone',
    })
    comment_permissions?: Permissions;

    @ApiPropertyOptional({
        enum: ['everyone', 'friends', 'no_one'],
        description: 'Anonymous message permissions',
        example: 'friends',
    })
    anonymous_message_permissions?: Permissions;

    @ApiPropertyOptional({
        type: Boolean,
        description: 'Enable seen receipt',
        example: true,
    })
    enable_seen_receipt?: boolean;

    @ApiPropertyOptional({
        type: Boolean,
        description: 'Recommend users',
        example: false,
    })
    recommend_users?: boolean;
}
