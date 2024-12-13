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
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(['group', 'post'])
  @IsNotEmpty()
  type: 'group' | 'post';

  @IsOptional()
  @IsDateString()
  closing_date?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  options: string[];
}
