import { MessageType } from './create-message.dto';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateMessageDto {
    @IsOptional()
    @IsNotEmpty()
    content?: string;

    @IsOptional()
    @IsBoolean()
    is_anonymous?: boolean;

    @IsOptional()
    @IsEnum(MessageType)
    type?: MessageType;
}
