/**
 * Payload tối thiểu cho product card (list / grid).
 * Trang chi tiết dùng API khác, không map full Product entity vào đây.
 */
export class ProductCardDto {
    id: number;
    slug: string;
    name: string;
    brand_name: string;
    thumbnail_url: string;
    base_price: number;
    final_price: number;
    discount_percent: number;
    rating_avg: number;
    rating_count?: number;
}
