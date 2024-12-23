import { PartialType } from '@nestjs/mapped-types';
import { CreatePrivacyDto } from './create-privacy.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Permissions } from '../entities/privacy.entity';

export class UpdatePrivacyDto extends PartialType(CreatePrivacyDto) { }
