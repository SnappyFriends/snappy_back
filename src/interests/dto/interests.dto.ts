import { IsString, IsNotEmpty } from 'class-validator';

export class CreateInterestDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateInterestDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}
