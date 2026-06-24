import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  isEmail,
  IsNotEmpty,
  IsStrongPassword,
  isNotEmpty,
  isStrongPassword,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email đăng nhập' })
  @IsEmail({}, { message: 'vui lòng nhập email hợp lệ' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Mật khẩu (tối thiểu 6 ký tự)' })
  @IsNotEmpty()
  @MinLength(6, { message: 'mật khẩu phải có ít nhất 6 ký tự' })
  password: string;
}
