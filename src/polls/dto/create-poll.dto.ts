import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  ArrayNotEmpty,
  IsArray,
  ArrayMaxSize,
} from 'class-validator';

export class CreatePollDto {
  @ApiProperty({
    type: String,
    description: 'Contenido de la encuesta, debe ser una cadena de texto no vacía',
    example: '¿Cual es tu color favorito?'
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    enum: ['group | post'],
    description: 'Tipo del recurso puede ser "group" o "post", es un enum',
    example: 'group'
  })
  @IsEnum(['group', 'post'])
  @IsNotEmpty()
  type: 'group' | 'post';

  @ApiProperty({
    type: Date,
    description: 'fecha de cierre de poll, es un dato opcional, formato ISO 8601',
    example: '2024-12-31T23:59:59Z'
  })
  @IsOptional()
  @IsDateString()
  closing_date?: string;

  @ApiProperty({
    type: [String],
    maxItems: 5,
    description: 'Lista de opciones, cada una debe ser una cadena de texto',
    example: ['opción1', 'opción2', 'opción3']
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  options: string[];
}
