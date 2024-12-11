import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdatePostDto {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(['text', 'video', 'image'])
  @IsOptional()
  type?: 'text' | 'video' | 'image';
}
