import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';
import { NewUserDto } from './dto/new-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
        
    @Get()
    getAll() {
        return this.authService.getAll();
    }

    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('new')
    create(@Body() dto: NewUserDto) {
        return this.authService.create(dto);
    }
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post('login')
    login(@Body() dto: LoginUserDto) {
        return this.authService.login(dto);
    }
}
