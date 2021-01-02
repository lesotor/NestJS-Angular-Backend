import { isNotEmpty, IsNotEmpty, IsNumber, Min } from "class-validator";
import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

export class ProductDto {


    @IsNotBlank({message: " The name can't be empty "})
    name?: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(10, {message: ' The price must be at least $ 10' })
    price?: number;
}