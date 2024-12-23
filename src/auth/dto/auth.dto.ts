import { PickType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class registerUserDTO {
    @ApiProperty({
        minLength: 3,
        maxLength: 80,
        description: 'Nombre completo del usuario, solo letras y espacios.',
        example: 'Abigail Contreras',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(80)
    @Matches(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/, {
        message: 'El nombre completo solo puede contener letras y espacios.',
    })
    fullname: string;

    @ApiProperty({
        type: String,
        description: 'El username del usuario, sin espacios ni caracteres especiales',
        example: 'abiContreras',
    })
    @IsNotEmpty()
    @IsString()
    @Matches(/^[A-Za-z0-9_]+$/, {
        message: 'El nombre de usuario no debe contener espacios ni caracteres especiales.',
    })
    username: string;

    @ApiProperty({
        type: String,
        description: 'Correo electrónico válido del usuario',
        example: 'abi@mail.com',
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        minLength: 8,
        maxLength: 20,
        type: String,
        description: 'Contraseña debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial (por ejemplo, !@#$%^&*).',
        example: 'abiContrera$2024',
    })
    @IsOptional()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    @MaxLength(20, { message: 'La contraseña debe tener como máximo 20 caracteres.' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
        message: 'La contraseña debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial (por ejemplo, !@#$%^&*).',
    })
    password: string;

    @ApiProperty({
        type: Date,
        description: 'Fecha de nacimiento del usuario en formato ISO (YYYY-MM-DD)',
        example: '1995-05-15',
    })
    @IsNotEmpty()
    @IsDateString()
    birthdate: string;

    @ApiProperty({
        type: String,
        description: 'Género del usuario, puede ser male, female u otros',
        example: 'female',
    })
    @IsNotEmpty()
    @IsString()
    genre: string;

    @ApiProperty({
        type: String,
        description: 'Descripción del usuario, máximo 255 caracteres.',
        example: 'Soy una persona muy alegre y me gusta mucho bailar.',
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    description: string;
}

export class LoginUserDTO extends PickType(registerUserDTO, [
    'email',
    'password'
<<<<<<< HEAD
]) { }
=======
]) {
    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'abi@mail.com',
    })
    email: string;

    @ApiProperty({
        description: 'La contraseña debe tener minimo 8 caracteres, máximo 8 caracteres y debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial (por ejemplo, !@#$%^&*).',
        example: 'abiContrera$2024',
    })
    password: string;

}
>>>>>>> 9232fe629410abd918c4cb2eeb0b930a722787a8
