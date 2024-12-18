import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePostDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  fileUrl: string;
}
