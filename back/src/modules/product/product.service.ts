import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  private products: any[] = [];

  create(product) {
    this.products.push(product);
    console.log(product);
    return product;
  }

  findAll() {
    return this.products;
  }

  findOne(id: number) {
    return this.products[id];
  }

  update(id: number, data) {
    this.products[id] = data;
    return data;
  }

  remove(id: number) {
    const deleted = this.products[id];
    this.products.splice(id, 1);
    return deleted;
  }
}