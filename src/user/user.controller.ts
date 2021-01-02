import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}
        
    @Get()
    getAll() {
        return this.userService.getAll();
    }

    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.userService.create(dto);
    }
}
