import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePollResponseDto {
  @IsString()
  @IsNotEmpty()
  selected_option: string;

  @IsUUID()
  @IsNotEmpty()
  user_id: string;
}
