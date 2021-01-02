import { IsEmail, IsString, MaxLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class NewUserDto {

    @IsString()
    @MaxLength(10, {message: 'name: maximum length is 10'})
    name: string;

    @IsNotBlank({message: 'the username cant be empty'})
    @MaxLength(10, {message: 'username: maximum length is 10'})
    userName: string;

    @IsEmail()
    email: string;

    @IsNotBlank({message: 'the password cant be empty'})
    password: string;
}