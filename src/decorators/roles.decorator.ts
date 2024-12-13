import { SetMetadata } from "@nestjs/common";
import { userType } from "src/users/entities/user.entity";

export const Roles = (...roles: userType[]) => SetMetadata("roles", roles);