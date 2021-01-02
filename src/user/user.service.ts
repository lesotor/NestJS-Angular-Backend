import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { RoleEntity } from 'src/role/role.entity';
import { RoleName } from 'src/role/role.enum';
import { RoleRepository } from 'src/role/role.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(RoleEntity)
        private readonly roleRepository: RoleRepository,
        @InjectRepository(UserEntity)
        private readonly userRepository: UserRepository
    ) {}

    async getAll(): Promise<UserEntity[]> {
        const users = await this.userRepository.find();
        if(!users.length) throw new NotFoundException(new MessageDto('there are no users in this list'));
        return users;
     }

    async create(dto: CreateUserDto): Promise<any> {
        const {userName, email} = dto;
        const exists = await this.userRepository.findOne({where: [{userName: userName}, {email: email}]});
        if(exists) throw new BadRequestException(new MessageDto('that user already exists'));
        const roleAdmin = await this.roleRepository.findOne({where: {roleName: RoleName.ADMIN}});
        const roleUser = await this.roleRepository.findOne({where: {roleName: RoleName.USER}});
        if (!roleAdmin || !roleUser) throw new InternalServerErrorException(new MessageDto('the roles have not yet been created'));
        const admin = this.userRepository.create(dto);
        admin.roles = [roleAdmin, roleUser];
        await this.userRepository.save(admin);
        return new MessageDto('admin created');
    }
}
