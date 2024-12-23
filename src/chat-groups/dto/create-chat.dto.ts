import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class CreateChatDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  userIds: string[];
}
