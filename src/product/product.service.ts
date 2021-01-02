import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { ProductDto } from './dto/product.dto';
import { ProductEntity } from './product.entity';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private productRepository: ProductRepository
    ) {}
    async getAll(): Promise<ProductEntity[]> {
        const list = await this.productRepository.find();
        if(!list.length) {
           throw new NotFoundException(new MessageDto(' The list is empty '));
        }
        return list;
    }

    async findById(id: number): Promise<ProductEntity> {
        const product = await this.productRepository.findOne(id);
        if(!product) {
            throw new NotFoundException(new MessageDto(' Does not exist '));
        }
        return product;
    }
    async findByName(name: string): Promise<ProductEntity> {
        const product = await this.productRepository.findOne({ name: name });
        return product;
    }
    async create(dto: ProductDto): Promise<any> {
        const exists = await this.findByName(dto.name);
        if(exists) throw new BadRequestException(new MessageDto(' This name already exists '));
        const product = this.productRepository.create(dto);
        await this.productRepository.save(product);
        // return {message: `product ${product.name} created`};
        return new MessageDto(`product ${product.name} created`);
    }

    async update(id:number, dto: ProductDto): Promise<any> {
        const product = await this.findById(id);
        if(!product)
        throw new NotFoundException(new MessageDto(' This product does not exist' ));
        const exists = await this.findByName(dto.name);
        if(exists && exists.id !==id) throw new BadRequestException({message: ' This name already exists '})
        dto.name? product.name = dto.name : product.name = product.name;
        dto.price? product.price = dto.price : product.price = product.price;
        await this.productRepository.save(product);
        return new MessageDto(` Product ${product.name} updated `);

    }
    async delete(id: number): Promise<any> {
        const product = await this.findById(id);
        await this.productRepository.delete(product);
        return new MessageDto(` Product ${product.name} deleted `);

    }
}
