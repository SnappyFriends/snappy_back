import { IsNotEmpty, IsString, IsUUID } from "class-validator";


export class CreateCommentDto {

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsUUID()
    user_id: string

    @IsNotEmpty()
    @IsUUID()
    post_id: string

}
