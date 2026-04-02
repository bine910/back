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
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được bỏ trống' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được bỏ trống' })
  @MinLength(8, { message: 'Mật khẩu phải dài ít nhất 8 ký tự' })
  @MaxLength(32, { message: 'Mật khẩu không được dài quá 32 ký tự' })
  password: string;


  @IsNotEmpty({ message: 'Họ tên không được bỏ trống' })
  @IsString()
  @MaxLength(255)
  full_name: string;

  @IsOptional()
  @Matches(/^(0|\+84)[0-9]{9}$/, {
    message: 'Số điện thoại không hợp lệ',
  })
  phone_number?: string;

  @IsOptional()
  @IsString()
  avatar_url?: string;
}