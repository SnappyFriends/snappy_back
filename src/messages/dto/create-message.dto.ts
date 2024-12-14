import { IsEnum, IsNotEmpty } from "class-validator";

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  ANONYMOUS = 'anonymous',
}

export enum MessageReceiver {
  READ = 'read',
  UNREAD = 'unread',
}

export class CreateMessageDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @IsEnum(MessageType)
  type: MessageType;

}
