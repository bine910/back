import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '../user/dto/register.dto';
import { LoginDto } from '../user/dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    // REGISTER
    async register(dto: RegisterDto) {
        const existing = await this.userService.findByEmail(dto.email);
        if (existing) throw new BadRequestException('Email đã tồn tại');

        const hashed = await bcrypt.hash(dto.password, 10);

        const user = await this.userService.create({
            ...dto,
            password_hash: hashed,
        });

        return { message: 'Đăng ký thành công', email: user.email, full_name: user.full_name, role: user.role };
    }

    // LOGIN
    async login(dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email);
        if (!user) throw new UnauthorizedException('Email không tồn tại');

        const isMatch = await bcrypt.compare(dto.password, user.password_hash);
        if (!isMatch) throw new UnauthorizedException('Sai mật khẩu');

        const payload = { id: user.id, email: user.email, role: user.role };
        const token = await this.jwtService.signAsync(payload);

        return { access_token: token };
    }
}