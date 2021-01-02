  import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'product'})
export class ProductEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 10, nullable: false, unique: true})
    name: string;

    @Column({type: 'float', nullable: false})
    price: number;
}