import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Categories } from '../categories/categories.entity';
import * as data from "../../utils/archivo.json";
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async getAllProducts(page: number, limit: number): Promise<Products[]> {
    let products = await this.productsRepository.find({
      relations: {
        category: true,
      },
    });
    const start = (page - 1) * limit;
    const end = start + limit;
    products = products.slice(start, end);

    return products;
  }

  async getOneProduct(id: string): Promise<Products> {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }

    return product;
  }

  async updateProducts(id: string, product: Products) {
    await this.productsRepository.update(id, product);
    const updateProduct = await this.productsRepository.findOneBy({ id });
    return updateProduct;
  }

  async deleteProducts(id: string): Promise<void> {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }

    await this.productsRepository.delete(id);
  }

  async addProducts() {
    if (!Array.isArray(data['default'])) {
      throw new Error('El archivo JSON no contiene un array válido de productos.');
    }

    const categories = await this.categoriesRepository.find();

    for (const element of data['default']) {
      const category = categories.find(
        (category) => category.name === element.categoryName,
      );

      if (!category) {
        throw new NotFoundException(`Categoría ${element.categoryName} no encontrada`);
      }

      const product = this.productsRepository.create({
        name: element.name,
        description: element.description,
        price: element.price,
        imgUrl: element.imgUrl,
        stock: element.stock,
        category: category,
        waist: element.waist ? element.waist.toString() : null, 
        weight: element.weight,
      });

      await this.productsRepository.save(product);
    }

    return 'Productos Agregados';
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Products> {
    const category = await this.categoriesRepository.findOne({
      where: { name: createProductDto.category },
    });

    if (!category) {
      throw new NotFoundException(`Categoría ${createProductDto.category} no encontrada`);
    }

    const product = this.productsRepository.create({
      ...createProductDto,
      category,
      waist: createProductDto.waist ? createProductDto.waist.toString() : null, 
    });

    return this.productsRepository.save(product);
  }
}


