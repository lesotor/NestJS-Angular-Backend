import { IsEnum } from "class-validator";
import { RoleName } from "../role.enum";

export class CreateRoleDto {

    @IsEnum(RoleName, {message: 'the role only can be user or admin'}) 
    roleName: string;
}