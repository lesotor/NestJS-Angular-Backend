import { RoleRepository } from './role.repository';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './role.entity';
import { MessageDto } from 'src/common/message.dto';
import { CreateRoleDto } from './dto/create-role.dto';


@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(RoleEntity)
        private readonly roleRepository: RoleRepository
    ) {}

    async getAll(): Promise<RoleEntity[]> {
       const roles = await this.roleRepository.find();
       if(!roles.length) throw new NotFoundException(new MessageDto('there are no roles in this list'));
       return roles;
    }

    async create(dto: CreateRoleDto): Promise<any> {
        const exists = await this.roleRepository.findOne({where: {roleName: dto.roleName}});
        if(exists) throw new BadRequestException(new MessageDto('that role already exists'));
        await this.roleRepository.save(dto as RoleEntity);
        return new MessageDto('role created');
    }
}
