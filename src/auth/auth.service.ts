import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { MessageDto } from 'src/common/message.dto';
import { RoleEntity } from 'src/role/role.entity';
import { RoleName } from 'src/role/role.enum';
import { RoleRepository } from 'src/role/role.repository';
import { UserEntity } from 'src/user/user.entity';
import { AuthRepository } from './auth.repository';
import { LoginUserDto } from './dto/login.dto';
import { NewUserDto } from './dto/new-user.dto';
import { PayloadInteface } from './payload.interface';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(RoleEntity)
        private readonly roleRepository: RoleRepository,
        @InjectRepository(UserEntity)
        private readonly authRepository: AuthRepository,
        private readonly jwtSevice: JwtService
    ) {}

    async getAll(): Promise<UserEntity[]> {
        const users = await this.authRepository.find();
        if(!users.length) throw new NotFoundException(new MessageDto('there are no users in this list'));
        return users;
     }

    async create(dto: NewUserDto): Promise<any> {
        const {userName, email} = dto;
        const exists = await this.authRepository.findOne({where: [{userName: userName}, {email: email}]});
        if(exists) throw new BadRequestException(new MessageDto('that user already exists'));
        const roleUser = await this.roleRepository.findOne({where: {roleName: RoleName.USER}});
        if (!roleUser) throw new InternalServerErrorException(new MessageDto('the roles have not yet been created'));
        const user = this.authRepository.create(dto);
        user.roles = [roleUser];
        await this.authRepository.save(user);
        return new MessageDto('user created');
    }

    async login(dto: LoginUserDto): Promise<any> {
        const {userName} = dto;
        const user = await this.authRepository.findOne({where: [{userName: userName}, {email: userName}]});
        if(!user) return new UnauthorizedException(new MessageDto('username does not exist'));
        const passwordOK = await compare(dto.password, user.password);
        if(!passwordOK) return new UnauthorizedException(new MessageDto('wrong password'));
        const payload: PayloadInteface = {
            id: user.id,
            userName: user.userName,
            email: user.email,
            roles: user.roles.map(role => role.roleName as RoleName)
        }
        const token = await this.jwtSevice.sign(payload);
        return {token};

    }
}
