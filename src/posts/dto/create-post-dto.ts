import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePostDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(['text', 'video', 'image'])
  @IsNotEmpty()
  type: 'text' | 'video' | 'image';
}
