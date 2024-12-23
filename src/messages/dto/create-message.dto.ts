import {
  IsNotEmpty,
  IsEnum,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  ANONYMOUS = 'anonymous',
}

export class CreateMessageDto {
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  @IsOptional()
  is_anonymous: boolean;

  @IsNotEmpty()
  @IsEnum(MessageType)
  type: MessageType;

  @IsNotEmpty()
  @IsUUID()
  sender_id: string;

  @IsOptional()
  @IsUUID()
  chatId?: string;

  @IsOptional()
  @IsUUID()
  groupId?: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  messageReceivers?: string[];
}
