import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsUUID } from "class-validator";

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
  is_anonnymous: Boolean;

  @IsNotEmpty()
  @IsEnum(MessageType)
  type: MessageType;


  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsArray()
  @IsNotEmpty()
  @IsUUID(undefined, { each: true })
  messageReceivers: string[];

}



