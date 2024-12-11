import { PartialType } from '@nestjs/mapped-types';
import { CreatePollResponseDto } from './create-poll-response.dto';

export class UpdatePollResponseDto extends PartialType(CreatePollResponseDto) {}
