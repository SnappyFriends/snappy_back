import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { registerUserDTO } from "src/auth/dto/auth.dto";

export class UpdateUserDTO extends PartialType(registerUserDTO) {
    @ApiProperty({
        example: 'Abigail Contreras',
        description: 'Nombre completo del usuario, solo letras y espacios. Min: 3, Max: 80 caracteres',
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
        example: 'AbiContrera$2024',
        description: 'La contraseña debe tener minimo 8 caracteres, máximo 8 caracteres y debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial (por ejemplo, !@#$%^&*).'
    })
    password?: string;

    @ApiProperty({
        example: '1995-05-15',
        description: 'Fecha de nacimiento del usuario en formato ISO (YYYY-MM-DD)',
    })
    birthdate?: string;

    @ApiProperty({
        example: 'female',
        description: 'Género del usuario, puede ser male, female u otros',
    })
    genre?: string;
}
