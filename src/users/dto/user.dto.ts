import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { registerUserDTO } from "src/auth/dto/auth.dto";

export class UpdateUserDTO extends PartialType(registerUserDTO) {
    @ApiProperty({
        type: String,
        minLength: 3,
        maxLength: 80,
        description: 'Nombre completo del usuario, solo letras y espacios.',
        example: 'Abigail Contreras',
    })
    fullname?: string;

    @ApiProperty({
        example: 'abiContreras',
        description: 'El username del usuario, sin espacios ni caracteres especiales',
    })
    username?: string;

    @ApiProperty({
        example: 'abi@mail.com',
        description: 'Correo electrónico válido del usuario',
    })
    email?: string;

    @ApiProperty({
        minLength: 8,
        maxLength: 20,
        type: String,
        description: 'Contraseña debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial (por ejemplo, !@#$%^&*).',
        example: 'abiContrera$2024',
    })
    password?: string;

    @ApiProperty({
        description: 'Fecha de nacimiento del usuario en formato ISO (YYYY-MM-DD)',
        example: '1995-05-15',
    })
    birthdate?: string;

    @ApiProperty({
        type: String,
        description: 'Género del usuario, puede ser male, female u otros',
        example: 'female',
    })
    genre?: string;
}
