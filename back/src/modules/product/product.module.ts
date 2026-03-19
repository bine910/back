import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { UserService } from '../user/user.service';

@Module({
  imports: [UserService],
  providers: [ProductService],
  controllers: [ProductController],
    exports: [ProductService],
})

export class ProductModule {}
