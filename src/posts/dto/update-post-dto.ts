import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdatePostDto {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  fileUrl?: string;
}
