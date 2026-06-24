import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email đăng ký' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được bỏ trống' })
  email: string;

  @ApiProperty({ example: 'Abcd1234!', description: 'Mật khẩu (8–32 ký tự)' })
  @IsNotEmpty({ message: 'Mật khẩu không được bỏ trống' })
  @MinLength(8, { message: 'Mật khẩu phải dài ít nhất 8 ký tự' })
  @MaxLength(32, { message: 'Mật khẩu không được dài quá 32 ký tự' })
  password: string;

  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Họ và tên' })
  @IsNotEmpty({ message: 'Họ tên không được bỏ trống' })
  @IsString()
  @MaxLength(255)
  full_name: string;

  @ApiPropertyOptional({ example: '0901234567', description: 'Số điện thoại (tùy chọn)' })
  @IsOptional()
  @Matches(/^(0|\+84)[0-9]{9}$/, {
    message: 'Số điện thoại không hợp lệ',
  })
  phone_number?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg', description: 'URL ảnh đại diện (tùy chọn)' })
  @IsOptional()
  @IsString()
  avatar_url?: string;
}
