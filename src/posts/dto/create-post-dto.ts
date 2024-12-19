import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    type: String,
    description: 'uuid de user tipo string',
    example: 'b070ed7b-217e-4294-91f3-e17be09d3fb7'
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    type: String,
    description: 'Contenido del post, de tipo string',
    example: 'Estoy feliz!! Quiero compartir esta foto con uds. Espero tengan un bendecido inicio de semana ♥'
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    type: String,
    description: 'URL o link del video o imagen a postear',
    example: 'https://example.com/image.png'
  })
  @IsString()
  fileUrl: string;
}
