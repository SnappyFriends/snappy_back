import { PartialType } from "@nestjs/mapped-types";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { registerUserDTO } from "src/auth/dto/auth.dto";


export class UpdateUserDTO extends PartialType(registerUserDTO) { }


export class GetUsersDTO {
    @ApiPropertyOptional({ description: 'The page number for pagination (default: 1)', example: 1 })
    @IsOptional()
    page: number = 1;

    @ApiPropertyOptional({ description: 'The maximum number of users per page (default: 5)', example: 5 })
    @IsOptional()
    limit: number = 5;

    @IsOptional()
    @IsString()
    username?: string;

    @ApiPropertyOptional({ description: 'List of interests', example: ['Deportes', 'Videojuegos'] })
    @IsOptional()
    @IsString({ each: true })
    interests?: string[];
}

