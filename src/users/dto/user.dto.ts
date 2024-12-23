import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { registerUserDTO } from "src/auth/dto/auth.dto";

export class UpdateUserDTO extends PartialType(registerUserDTO) { }
