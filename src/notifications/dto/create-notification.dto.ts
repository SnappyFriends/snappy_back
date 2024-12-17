import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsUUID()
  user_id: string;
}
