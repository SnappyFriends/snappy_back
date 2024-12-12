import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateReactionDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsEnum(['like', 'dislike'])
  @IsNotEmpty()
  reaction: 'like' | 'dislike';

  @IsEnum(['comment', 'post'])
  @IsNotEmpty()
  reaction_type: 'comment' | 'post';
}

export class UpdateReactionDto extends PartialType(CreateReactionDto) {}
