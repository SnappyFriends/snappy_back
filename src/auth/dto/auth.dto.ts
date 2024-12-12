import { PickType } from "@nestjs/mapped-types";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength, Validate } from "class-validator";
import { MatchPassword } from "src/decorators/matchPassword.decorator";

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

    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    @MaxLength(15, { message: 'La contraseña debe tener como máximo 15 caracteres.' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
        message: 'La contraseña debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial (por ejemplo, !@#$%^&*).',
    })
    password: string;

    @IsNotEmpty()
    @Validate(MatchPassword, ['password'])
    confirmPassword: string;
}

export class LoginUserDTO extends PickType(registerUserDTO, [
    'email',
    'password'
]) { }
