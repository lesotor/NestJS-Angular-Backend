import { hash } from "bcryptjs";
import { RoleEntity } from "src/role/role.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'user'})
export class UserEntity {
    
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 10, nullable: true})
    name: string;

    @Column({type: 'varchar', length: 10, nullable: false, unique: true})
    userName: string;

    @Column({type: 'varchar', nullable: false, unique: true})
    email: string;

    @Column({type: 'varchar', nullable: false, unique: true})
    password: string;

    @ManyToMany(_type => RoleEntity, role => role.users, {eager: true})
    roles: RoleEntity[];

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if(!this.password) return;
        this.password = await hash(this.password, 10);
    }
}