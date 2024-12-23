import { PartialType } from "@nestjs/mapped-types";
import { registerUserDTO } from "src/auth/dto/auth.dto";

export class UpdateUserDTO extends PartialType(registerUserDTO) { }
