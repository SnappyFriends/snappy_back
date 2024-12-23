import { IsString } from "class-validator";

export class CreateReportDto {
    @IsString()
    reporting: string;

    @IsString()
    reported: string;

    @IsString()
    description: string;
}
