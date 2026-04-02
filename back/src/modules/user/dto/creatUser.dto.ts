export interface CreateUserDto {
    id?: number;
    email: string;
    password_hash: string;
    full_name: string;
    phone_number?: string;
    avatar_url?: string;
} 