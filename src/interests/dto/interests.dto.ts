import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateInterestDTO {
  @ApiProperty({
    type: String,
    description: 'name of interest',
    example: 'Música'
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateInterestDTO {
  @ApiProperty({
    type: String,
    description: 'name of interest',
    example: 'Música'
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
