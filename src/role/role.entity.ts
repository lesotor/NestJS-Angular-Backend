import { UserEntity } from "src/user/user.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoleName } from "./role.enum";

@Entity({name: 'role'})
export class RoleEntity {
    
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 10, nullable: false, unique: true})
    roleName: RoleName;

    @ManyToMany(_type => UserEntity, user => user.roles)
    @JoinTable({
        name: 'user_role',
        joinColumn: {name: 'user_id'},
        inverseJoinColumn: {name: 'role_id'}
    })
    users: UserEntity[];

    

}   