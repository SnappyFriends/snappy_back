import { PickType } from "@nestjs/mapped-types";
import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class registerUserDTO {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(80)
    @Matches(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/, {
        message: 'El nombre completo solo puede contener letras y espacios.',
    })
    fullname: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^[A-Za-z0-9_]+$/, {
        message: 'El nombre de usuario no debe contener espacios ni caracteres especiales.',
    })
    username: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsOptional()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    @MaxLength(20, { message: 'La contraseña debe tener como máximo 20 caracteres.' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
        message: 'La contraseña debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial (por ejemplo, !@#$%^&*).',
    })
    password: string;

    @IsNotEmpty()
    @IsDateString()
    birthdate: string;

    @IsNotEmpty()
    @IsString()
    genre: string;
}

export class LoginUserDTO extends PickType(registerUserDTO, [
    'email',
    'password'
]) { }
