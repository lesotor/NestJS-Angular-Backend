import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { MessageDto } from 'src/common/message.dto';
import { RoleDecorator } from 'src/decorators/role.decorator';
import { RoleName } from 'src/role/role.enum';
import { ProductDto } from './dto/product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @RoleDecorator(RoleName.ADMIN, RoleName.USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async getAll() {
        return await this.productService.getAll();
    }

    @RoleDecorator(RoleName.ADMIN, RoleName.USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number) {
        return await this.productService.findById(id);
    }

    @RoleDecorator(RoleName.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Post()
    async create(@Body() dto: ProductDto) {
        return await this.productService.create(dto);
    }

    @RoleDecorator(RoleName.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: ProductDto) {
        return await this.productService.update(id, dto);
    }

    @RoleDecorator(RoleName.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.productService.delete(id)
    }
}
