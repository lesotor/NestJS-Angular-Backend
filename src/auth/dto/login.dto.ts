import { MaxLength } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class LoginUserDto {


    @IsNotBlank({message: 'the username cant be empty'})
    @MaxLength(10, {message: 'username: maximum length is 10'})
    userName: string;


    @IsNotBlank({message: 'the password cant be empty'})
    password: string;
}