import { IsString, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateChatGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsEnum(['PUBLIC', 'PRIVATE'])
  privacy: 'PUBLIC' | 'PRIVATE';

  @IsString()
  @IsNotEmpty()
  creator_id: string;
}
