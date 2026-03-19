import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ProductService } from '../product/product.service';
@Module({
    imports: [ProductService],
    controllers: [],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
