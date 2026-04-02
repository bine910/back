import {IsEmail, isEmail,IsNotEmpty,IsStrongPassword,isNotEmpty,isStrongPassword, MinLength} from 'class-validator'

export class LoginDto{
    @IsEmail({}, { message: 'vui lòng nhập email hợp lệ' })
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(6, { message: 'mật khẩu phải có ít nhất 6 ký tự' })
    password: string;
}