import { Controller, Get, Post, Body, Param, Put, Delete } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "../../entities/user.entity";
import { LoginDto } from "./dto/login.dto";
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {
    }
    @Get()
    findAll() {
        return this.userService.findAll();
    }
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.userService.findOne(id);
    }
   
}
