import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePollResponseDto {

  @ApiProperty({
    type: String,
    description: 'Opción a seleccionar de Poll',
    example: 'group'
  })
  @IsString()
  @IsNotEmpty()
  selected_option: string;

  @ApiProperty({
    type: String,
    description: 'UUID de user',
    example: '168bde23-b10d-4af9-807e-7d6405d378a7'
  })

  @IsUUID()
  @IsNotEmpty()
  user_id: string;
}
