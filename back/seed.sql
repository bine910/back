-- Xoá dữ liệu cũ (nếu có) để tránh lỗi trùng lặp khi chạy lại file này nhiều lần
TRUNCATE TABLE product_relations CASCADE;
TRUNCATE TABLE review_images CASCADE;
TRUNCATE TABLE product_reviews CASCADE;
TRUNCATE TABLE cart_items CASCADE;
TRUNCATE TABLE product_variants CASCADE;
TRUNCATE TABLE product_images CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE brands CASCADE;
TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE users CASCADE;

-- Reset sequence id
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE brands_id_seq RESTART WITH 1;
ALTER SEQUENCE products_id_seq RESTART WITH 1;
ALTER SEQUENCE product_images_id_seq RESTART WITH 1;
ALTER SEQUENCE product_variants_id_seq RESTART WITH 1;
ALTER SEQUENCE product_reviews_id_seq RESTART WITH 1;

-- ==========================================
-- 1. Thêm Dữ liệu Căn bản: Users (Khách hàng mẫu), Categories, Brands
-- ==========================================

-- Cần 1 user để gắn vào các lượt review
-- Giá trị phải khớp users_role_enum trong DB: 'user' | 'admin' (UserRole.CUSTOMER = 'user' trong app)
INSERT INTO users (id, email, password_hash, full_name, role) VALUES 
(1, 'customer1@example.com', 'hashed_pw', 'Nguyễn Văn A', 'user'),
(2, 'customer2@example.com', 'hashed_pw', 'Trần Thị B', 'user');

-- Categories
INSERT INTO categories (id, name, slug) VALUES 
(1, 'T-Shirt', 't-shirt');

-- Brands (Lấy tất cả Brand từ JSON cũ)
INSERT INTO brands (id, name, slug) VALUES 
(1, 'UniStyle', 'uni-style'),
(2, 'StreetX', 'street-x'),
(3, 'ClassicWear', 'classic-wear'),
(4, 'UrbanFit', 'urban-fit'),
(5, 'SoftWear', 'soft-wear'),
(6, 'StyleWear', 'style-wear'),
(7, 'UrbanStyle', 'urban-style'),
(8, 'DailyWear', 'daily-wear'),
(9, 'SimpleWear', 'simple-wear'),
(10, 'ComfortWear', 'comfort-wear');

-- ==========================================
-- 2. Thêm Sản phẩm (Bảng products, extra JSONB)
-- Lưu ý: Id của product trong JSON cũ bắt đầu từ 0, ta giữ nguyên hoặc tốt nhất là cộng thêm 1 để chuẩn PostgreSQL Sequence (từ 1 đến 15).
-- Tuy nhiên để khớp chuẩn ID relations `relatedProducts` trong mảng, ta sẽ giữ ĐÚNG ID TỪ JSON CŨ (0->14), 
-- PostgreSQL sẽ insert cứng ID mà bạn set.
-- ==========================================

-- Chèn cứng ID luôn
INSERT INTO products (id, category_id, brand_id, name, slug, description, base_price, discount_percent, extra, is_active, created_at) VALUES 
(0, 1, 1, 'Basic Cotton T-Shirt', 'basic-cotton-t-shirt-0', 'Basic cotton T-shirt for daily wear', 19900, 10, '{"product_details":{"Size_Fit":"Regular fit","Material_Care":"100% cotton, machine wash","Product_detail":"Basic cotton T-shirt for daily wear"},"specifications":{"sleeveLength":"Short Sleeve","printType":"Solid","length":"Regular","liningFabric":"None","hemline":"Straight","type":"Casual","collar":"Round Neck","closure":"None","numberOfPockets":0,"occasion":"Casual"}}', true, '2025-09-10 00:00:00'),
(1, 1, 1, 'Premium Black T-Shirt', 'premium-black-t-shirt-1', 'High-quality black T-shirt', 24900, 15, '{"product_details":{"Size_Fit":"Slim fit","Material_Care":"Cotton blend","Product_detail":"High-quality black T-shirt"},"specifications":{"sleeveLength":"Short","printType":"None","length":"Regular","liningFabric":"None","hemline":"Straight","type":"Basic","collar":"Round","closure":"None","numberOfPockets":0,"occasion":"Daily"}}', true, '2025-09-11 00:00:00'),
(2, 1, 2, 'Graphic Printed Tee', 'graphic-printed-tee-2', 'Street-style printed T-shirt', 29900, 20, '{"product_details":{"Size_Fit":"Loose fit","Material_Care":"Hand wash recommended","Product_detail":"Street-style printed T-shirt"},"specifications":{"sleeveLength":"Short","printType":"Graphic","length":"Regular","liningFabric":"None","hemline":"Curved","type":"Street Wear","collar":"Round","closure":"None","numberOfPockets":0,"occasion":"Casual"}}', true, '2025-03-19 00:00:00'),
(3, 1, 1, 'Oversized White Tee', 'oversized-white-tee-3', 'Trendy oversized T-shirt', 25900, 5, '{"product_details":{"Size_Fit":"Oversized","Material_Care":"Soft cotton","Product_detail":"Trendy oversized T-shirt"},"specifications":{"sleeveLength":"Short","printType":"Solid","length":"Long","liningFabric":"None","hemline":"Straight","type":"Fashion","collar":"Round","closure":"None","numberOfPockets":0,"occasion":"Street"}}', true, '2025-03-20 00:00:00'),
(4, 1, 3, 'V-Neck Cotton Tee', 'v-neck-cotton-tee-4', 'V-neck soft cotton T-shirt', 21900, 8, '{"product_details":{"Size_Fit":"Regular","Material_Care":"Machine wash cold","Product_detail":"V-neck soft cotton T-shirt"},"specifications":{"sleeveLength":"Short","printType":"None","length":"Regular","liningFabric":"None","hemline":"Straight","type":"V-neck","collar":"V-neck","closure":"None","numberOfPockets":0,"occasion":"Casual"}}', true, '2025-03-01 00:00:00'),
(5, 1, 1, 'Sport Dry-Fit Tee', 'sport-dry-fit-tee-5', 'Moisture-wicking athletic T-shirt', 27900, 12, '{"product_details":{"Size_Fit":"Athletic","Material_Care":"Polyester blend","Product_detail":"Moisture-wicking athletic T-shirt"},"specifications":{"sleeveLength":"Short","printType":"Minimal","length":"Regular","liningFabric":"None","hemline":"Straight","type":"Sport","collar":"Round","closure":"None","numberOfPockets":0,"occasion":"Sport"}}', true, '2025-03-24 00:00:00'),
(6, 1, 4, 'Striped Casual Tee', 'striped-casual-tee-6', 'Striped casual T-shirt', 239000, 10, '{"product_details":{"Size_Fit":"Slim","Material_Care":"Soft cotton","Product_detail":"Striped casual T-shirt"},"specifications":{"sleeveLength":"Short","printType":"Stripes","length":"Regular","liningFabric":"None","hemline":"Straight","type":"Casual","collar":"Round","closure":"None","numberOfPockets":0,"occasion":"Everyday"}}', true, '2025-03-04 00:00:00'),
(7, 1, 1, 'Beige Minimal Tee', 'beige-minimal-tee-7', 'Minimal beige tee', 22900, 10, '{"product_details":{"Size_Fit":"Regular","Material_Care":"Cotton","Product_detail":"Minimal beige tee"},"specifications":{"sleeveLength":"Short","printType":"Solid","length":"Regular","liningFabric":"None","hemline":"Straight","type":"Basic","collar":"Round","closure":"None","numberOfPockets":0,"occasion":"Casual"}}', true, '2025-05-19 00:00:00'),
(8, 1, 5, 'Pastel Pink Tee', 'pastel-pink-tee-8', 'Soft pastel T-shirt', 79900, 5, '{"product_details":{"Size_Fit":"Regular","Material_Care":"Soft cotton blend","Product_detail":"Soft pastel T-shirt"},"specifications":{"sleeveLength":"Short","printType":"Solid","length":"Regular","liningFabric":"None","hemline":"Straight","type":"Casual","collar":"Round","closure":"None","numberOfPockets":0,"occasion":"Daily"}}', true, '2025-09-08 00:00:00'),
(9, 1, 1, 'Vintage Wash Tee', 'vintage-wash-tee-9', 'Vintage washed look', 26900, 18, '{"product_details":{"Size_Fit":"Loose","Material_Care":"Machine wash","Product_detail":"Vintage washed look"},"specifications":{"sleeveLength":"Short","printType":"Vintage","length":"Regular","liningFabric":"None","hemline":"Straight","type":"Retro","collar":"Round","closure":"None","numberOfPockets":0,"occasion":"Street"}}', true, '2025-06-05 00:00:00'),
(10, 1, 6, 'Casual Cotton Tee', 'casual-cotton-tee-10', 'Soft cotton T-shirt for everyday comfort', 11000, 10, '{"product_details":{"Size_Fit":"Regular","Material_Care":"Machine wash cold","Product_detail":"Soft cotton T-shirt for everyday comfort"},"specifications":{"sleeveLength":"Short","printType":"None","length":"Regular","liningFabric":"None","hemline":"Straight","type":"Crew Neck","collar":"Round","closure":"None","numberOfPockets":0,"occasion":"Casual"}}', true, '2025-12-29 00:00:00'),
(11, 1, 7, 'Premium Soft Tee', 'premium-soft-tee-11', 'Premium cotton tee with breathable fabric', 23000, 5, '{"product_details":{"Size_Fit":"Regular","Material_Care":"Machine wash","Product_detail":"Premium cotton tee with breathable fabric"},"specifications":{"sleeveLength":"Short","printType":"None","length":"Regular","liningFabric":"None","hemline":"Straight","type":"Round Neck","collar":"Round","closure":"None","numberOfPockets":0,"occasion":"Casual"}}', true, '2025-12-14 00:00:00'),
(12, 1, 8, 'Everyday Comfort Tee', 'everyday-comfort-tee-12', 'Lightweight tee suitable for hot weather', 49000, 12, '{"product_details":{"Size_Fit":"Regular","Material_Care":"Hand wash or machine wash","Product_detail":"Lightweight tee suitable for hot weather"},"specifications":{"sleeveLength":"Short","printType":"None","length":"Regular","liningFabric":"None","hemline":"Straight","type":"Crew Neck","collar":"Round","closure":"None","numberOfPockets":0,"occasion":"Casual"}}', true, '2025-12-25 00:00:00'),
(13, 1, 9, 'Minimalist Tee', 'minimalist-tee-13', 'Minimalist design with clean lines', 60000, 7, '{"product_details":{"Size_Fit":"Regular","Material_Care":"Machine wash gentle","Product_detail":"Minimalist design with clean lines"},"specifications":{"sleeveLength":"Short","printType":"None","length":"Regular","liningFabric":"None","hemline":"Straight","type":"Crew Neck","collar":"Round","closure":"None","numberOfPockets":0,"occasion":"Casual"}}', true, '2025-05-27 00:00:00'),
(14, 1, 10, 'SoftTouch Tee', 'softtouch-tee-14', 'Extremely soft fabric with smooth texture', 70000, 6, '{"product_details":{"Size_Fit":"Regular","Material_Care":"Cold wash recommended","Product_detail":"Extremely soft fabric with smooth texture"},"specifications":{"sleeveLength":"Short","printType":"None","length":"Regular","liningFabric":"None","hemline":"Straight","type":"Round Neck","collar":"Round","closure":"None","numberOfPockets":0,"occasion":"Casual"}}', true, '2025-01-09 00:00:00');

-- Đồng bộ ID để ID kế tiếp được tạo đúng (do mình đã chèn thủ công ID 0->14)
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));


-- ==========================================
-- 3. Thêm Hình Ảnh (Bảng product_images)
-- ==========================================
INSERT INTO product_images (product_id, image_url, color_code, is_primary, display_order) VALUES 
-- Product 0
(0, 'https://images.pexels.com/photos/802417/pexels-photo-802417.jpeg', 'White', true, 1),
-- Product 1
(1, 'https://images.pexels.com/photos/1525852/pexels-photo-1525852.jpeg', 'Black', true, 1),
-- Product 2
(2, 'https://images.pexels.com/photos/3820312/pexels-photo-3820312.jpeg', 'Black', true, 1),
-- Product 3
(3, 'https://images.pexels.com/photos/289998/pexels-photo-289998.jpeg', 'White', true, 1),
-- Product 4
(4, 'https://images.pexels.com/photos/3822114/pexels-photo-3822114.jpeg', 'Blue', true, 1),
-- Product 5
(5, 'https://images.pexels.com/photos/2916820/pexels-photo-2916820.jpeg', 'Gray', true, 1),
-- Product 6
(6, 'https://images.pexels.com/photos/2306213/pexels-photo-2306213.jpeg', 'Navy', true, 1),
-- Product 7
(7, 'https://images.pexels.com/photos/4553272/pexels-photo-4553272.jpeg', 'Beige', true, 1),
-- Product 8
(8, 'https://images.pexels.com/photos/6787202/pexels-photo-6787202.jpeg', 'Pink', true, 1),
-- Product 9
(9, 'https://images.pexels.com/photos/4151865/pexels-photo-4151865.jpeg', 'Gray', true, 1),
-- Product 10
(10, 'https://images.pexels.com/photos/810775/pexels-photo-810775.jpeg', 'Default', true, 1),
-- Product 11
(11, 'https://images.pexels.com/photos/3772612/pexels-photo-3772612.jpeg', 'Default', true, 1),
-- Product 12
(12, 'https://images.pexels.com/photos/2908175/pexels-photo-2908175.jpeg', 'Default', true, 1),
-- Product 13
(13, 'https://images.pexels.com/photos/2421467/pexels-photo-2421467.jpeg', 'Default', true, 1),
-- Product 14
(14, 'https://images.pexels.com/photos/3094215/pexels-photo-3094215.jpeg', 'Default', true, 1);


-- ==========================================
-- 4. Thêm Size & Kho hàng (Bảng product_variants)
-- ==========================================
-- Dùng mã SKU theo cấu trúc PROD-{ID}-{Màu}-{Size}
INSERT INTO product_variants (product_id, sku, color, size, stock_quantity) VALUES 
-- Product 0
(0, 'PROD-0-WHI-XS', 'White', 'XS', 12), (0, 'PROD-0-WHI-S', 'White', 'S', 20), (0, 'PROD-0-WHI-M', 'White', 'M', 30), (0, 'PROD-0-WHI-L', 'White', 'L', 25), (0, 'PROD-0-WHI-XL', 'White', 'XL', 15),
-- Product 1
(1, 'PROD-1-BLK-XS', 'Black', 'XS', 8), (1, 'PROD-1-BLK-S', 'Black', 'S', 22), (1, 'PROD-1-BLK-M', 'Black', 'M', 34), (1, 'PROD-1-BLK-L', 'Black', 'L', 20), (1, 'PROD-1-BLK-XL', 'Black', 'XL', 17),
-- Product 2
(2, 'PROD-2-BLK-XS', 'Black', 'XS', 10), (2, 'PROD-2-BLK-S', 'Black', 'S', 18), (2, 'PROD-2-BLK-M', 'Black', 'M', 25), (2, 'PROD-2-BLK-L', 'Black', 'L', 33), (2, 'PROD-2-BLK-XL', 'Black', 'XL', 19),
-- Product 3
(3, 'PROD-3-WHI-XS', 'White', 'XS', 5), (3, 'PROD-3-WHI-S', 'White', 'S', 15), (3, 'PROD-3-WHI-M', 'White', 'M', 40), (3, 'PROD-3-WHI-L', 'White', 'L', 35), (3, 'PROD-3-WHI-XL', 'White', 'XL', 23),
-- Product 4
(4, 'PROD-4-BLU-XS', 'Blue', 'XS', 14), (4, 'PROD-4-BLU-S', 'Blue', 'S', 18), (4, 'PROD-4-BLU-M', 'Blue', 'M', 22), (4, 'PROD-4-BLU-L', 'Blue', 'L', 27), (4, 'PROD-4-BLU-XL', 'Blue', 'XL', 16),
-- Product 5
(5, 'PROD-5-GRA-XS', 'Gray', 'XS', 7), (5, 'PROD-5-GRA-S', 'Gray', 'S', 19), (5, 'PROD-5-GRA-M', 'Gray', 'M', 29), (5, 'PROD-5-GRA-L', 'Gray', 'L', 31), (5, 'PROD-5-GRA-XL', 'Gray', 'XL', 12),
-- Product 6
(6, 'PROD-6-NAV-XS', 'Navy', 'XS', 11), (6, 'PROD-6-NAV-S', 'Navy', 'S', 17), (6, 'PROD-6-NAV-M', 'Navy', 'M', 23), (6, 'PROD-6-NAV-L', 'Navy', 'L', 30), (6, 'PROD-6-NAV-XL', 'Navy', 'XL', 14),
-- Product 7
(7, 'PROD-7-BEI-XS', 'Beige', 'XS', 9), (7, 'PROD-7-BEI-S', 'Beige', 'S', 14), (7, 'PROD-7-BEI-M', 'Beige', 'M', 26), (7, 'PROD-7-BEI-L', 'Beige', 'L', 28), (7, 'PROD-7-BEI-XL', 'Beige', 'XL', 17),
-- Product 8
(8, 'PROD-8-PIN-XS', 'Pink', 'XS', 6), (8, 'PROD-8-PIN-S', 'Pink', 'S', 12), (8, 'PROD-8-PIN-M', 'Pink', 'M', 24), (8, 'PROD-8-PIN-L', 'Pink', 'L', 29), (8, 'PROD-8-PIN-XL', 'Pink', 'XL', 10),
-- Product 9
(9, 'PROD-9-GRA-XS', 'Gray', 'XS', 8), (9, 'PROD-9-GRA-S', 'Gray', 'S', 20), (9, 'PROD-9-GRA-M', 'Gray', 'M', 28), (9, 'PROD-9-GRA-L', 'Gray', 'L', 26), (9, 'PROD-9-GRA-XL', 'Gray', 'XL', 13),
-- Product 10
(10, 'PROD-10-DEF-XS', 'Default', 'XS', 12), (10, 'PROD-10-DEF-S', 'Default', 'S', 15), (10, 'PROD-10-DEF-M', 'Default', 'M', 20), (10, 'PROD-10-DEF-L', 'Default', 'L', 25), (10, 'PROD-10-DEF-XL', 'Default', 'XL', 18),
-- Product 11
(11, 'PROD-11-DEF-XS', 'Default', 'XS', 10), (11, 'PROD-11-DEF-S', 'Default', 'S', 14), (11, 'PROD-11-DEF-M', 'Default', 'M', 21), (11, 'PROD-11-DEF-L', 'Default', 'L', 23), (11, 'PROD-11-DEF-XL', 'Default', 'XL', 15),
-- Product 12
(12, 'PROD-12-DEF-XS', 'Default', 'XS', 11), (12, 'PROD-12-DEF-S', 'Default', 'S', 17), (12, 'PROD-12-DEF-M', 'Default', 'M', 19), (12, 'PROD-12-DEF-L', 'Default', 'L', 24), (12, 'PROD-12-DEF-XL', 'Default', 'XL', 13),
-- Product 13
(13, 'PROD-13-DEF-XS', 'Default', 'XS', 13), (13, 'PROD-13-DEF-S', 'Default', 'S', 16), (13, 'PROD-13-DEF-M', 'Default', 'M', 22), (13, 'PROD-13-DEF-L', 'Default', 'L', 26), (13, 'PROD-13-DEF-XL', 'Default', 'XL', 14),
-- Product 14
(14, 'PROD-14-DEF-XS', 'Default', 'XS', 15), (14, 'PROD-14-DEF-S', 'Default', 'S', 18), (14, 'PROD-14-DEF-M', 'Default', 'M', 23), (14, 'PROD-14-DEF-L', 'Default', 'L', 28), (14, 'PROD-14-DEF-XL', 'Default', 'XL', 16);


-- ==========================================
-- 5. Thêm Liên kết Sản phẩm (Bảng product_relations)
-- ==========================================
INSERT INTO product_relations (product_id, related_product_id, relation_type) VALUES 
-- Product 0: Similar
(0, 1, 'SIMILAR'), (0, 2, 'SIMILAR'), (0, 3, 'SIMILAR'),
-- Product 0: Also Like
(0, 11, 'CUSTOMER_ALSO_LIKE'), (0, 12, 'CUSTOMER_ALSO_LIKE'), (0, 13, 'CUSTOMER_ALSO_LIKE'),

-- Product 2 
(2, 9, 'SIMILAR'), (2, 10, 'SIMILAR'), (2, 12, 'SIMILAR'), (2, 14, 'SIMILAR'),
(2, 1, 'CUSTOMER_ALSO_LIKE'), (2, 3, 'CUSTOMER_ALSO_LIKE'), (2, 4, 'CUSTOMER_ALSO_LIKE'), (2, 5, 'CUSTOMER_ALSO_LIKE'),

-- Product 3
(3, 2, 'SIMILAR'), (3, 0, 'SIMILAR'), (3, 5, 'SIMILAR'),
(3, 7, 'CUSTOMER_ALSO_LIKE'), (3, 6, 'CUSTOMER_ALSO_LIKE'), (3, 8, 'CUSTOMER_ALSO_LIKE'), (3, 9, 'CUSTOMER_ALSO_LIKE'),

-- Product 4
(4, 12, 'SIMILAR'), (4, 13, 'SIMILAR'), (4, 14, 'SIMILAR'),
(4, 9, 'CUSTOMER_ALSO_LIKE'), (4, 10, 'CUSTOMER_ALSO_LIKE'), (4, 14, 'CUSTOMER_ALSO_LIKE'),

-- Product 5
(5, 6, 'SIMILAR'), (5, 7, 'SIMILAR'), (5, 8, 'SIMILAR'),
(5, 1, 'CUSTOMER_ALSO_LIKE'), (5, 2, 'CUSTOMER_ALSO_LIKE'), (5, 3, 'CUSTOMER_ALSO_LIKE'),

-- Product 6
(6, 1, 'SIMILAR'), (6, 2, 'SIMILAR'), (6, 3, 'SIMILAR'), (6, 4, 'SIMILAR'),
(6, 5, 'CUSTOMER_ALSO_LIKE'), (6, 7, 'CUSTOMER_ALSO_LIKE'),

-- Product 7
(7, 5, 'SIMILAR'), (7, 6, 'SIMILAR'), (7, 8, 'SIMILAR'),
(7, 1, 'CUSTOMER_ALSO_LIKE'), (7, 2, 'CUSTOMER_ALSO_LIKE'), (7, 3, 'CUSTOMER_ALSO_LIKE'),

-- Product 8
(8, 1, 'SIMILAR'), (8, 2, 'SIMILAR'), (8, 3, 'SIMILAR'),
(8, 2, 'CUSTOMER_ALSO_LIKE'), (8, 3, 'CUSTOMER_ALSO_LIKE'), -- Bỏ qua lặp trùng 1

-- Product 9
(9, 5, 'SIMILAR'), (9, 4, 'SIMILAR'), (9, 6, 'SIMILAR'),
(9, 1, 'CUSTOMER_ALSO_LIKE'), (9, 2, 'CUSTOMER_ALSO_LIKE'), (9, 3, 'CUSTOMER_ALSO_LIKE'),

-- Product 10-14 Similar/Also Like (chung dữ liệu mẫu 1, 2, 3) 
(10, 1, 'SIMILAR'), (10, 2, 'SIMILAR'), (10, 3, 'SIMILAR'),
(10, 1, 'CUSTOMER_ALSO_LIKE'), (10, 2, 'CUSTOMER_ALSO_LIKE'), (10, 3, 'CUSTOMER_ALSO_LIKE'),

(11, 1, 'SIMILAR'), (11, 2, 'SIMILAR'), (11, 3, 'SIMILAR'),
(11, 1, 'CUSTOMER_ALSO_LIKE'), (11, 2, 'CUSTOMER_ALSO_LIKE'), (11, 3, 'CUSTOMER_ALSO_LIKE'),

(12, 1, 'SIMILAR'), (12, 2, 'SIMILAR'), (12, 3, 'SIMILAR'),
(12, 1, 'CUSTOMER_ALSO_LIKE'), (12, 2, 'CUSTOMER_ALSO_LIKE'), (12, 3, 'CUSTOMER_ALSO_LIKE'),

(13, 1, 'SIMILAR'), (13, 2, 'SIMILAR'), (13, 3, 'SIMILAR'),
(13, 1, 'CUSTOMER_ALSO_LIKE'), (13, 2, 'CUSTOMER_ALSO_LIKE'), (13, 3, 'CUSTOMER_ALSO_LIKE'),

(14, 1, 'SIMILAR'), (14, 2, 'SIMILAR'), (14, 3, 'SIMILAR'),
(14, 1, 'CUSTOMER_ALSO_LIKE'), (14, 2, 'CUSTOMER_ALSO_LIKE'), (14, 3, 'CUSTOMER_ALSO_LIKE')

ON CONFLICT (product_id, related_product_id, relation_type) DO NOTHING;


-- ==========================================
-- 6. Thêm Đánh Giá & Hình Ảnh Đánh Giá (Bảng product_reviews, review_images)
-- Lấy từ JSON id 10 -> 14
-- ==========================================

-- Product 10 (Review id 1)
INSERT INTO product_reviews (id, product_id, user_id, rating, content, is_verified_purchase) VALUES 
(1, 10, 1, 4, 'Comfortable and soft material. Good for daily wear.', true);
INSERT INTO review_images (review_id, image_url) VALUES 
(1, 'https://images.pexels.com/photos/810775/pexels-photo-810775.jpeg');

-- Product 11 (Review id 2)
INSERT INTO product_reviews (id, product_id, user_id, rating, content, is_verified_purchase) VALUES 
(2, 11, 2, 4, 'Nice quality and comfortable. Good fitting.', true); -- Rating trong bảng là INT, nãy gán là 4 cho rating=4.3
INSERT INTO review_images (review_id, image_url) VALUES 
(2, 'https://images.pexels.com/photos/3772612/pexels-photo-3772612.jpeg');

-- Product 12 (Review id 3)
INSERT INTO product_reviews (id, product_id, user_id, rating, content, is_verified_purchase) VALUES 
(3, 12, 1, 4, 'Very light and comfortable. Perfect for everyday use.', true);
INSERT INTO review_images (review_id, image_url) VALUES 
(3, 'https://images.pexels.com/photos/2908175/pexels-photo-2908175.jpeg');

-- Product 13 (Review id 4)
INSERT INTO product_reviews (id, product_id, user_id, rating, content, is_verified_purchase) VALUES 
(4, 13, 2, 4, 'Simple but stylish. Material feels premium.', true);
INSERT INTO review_images (review_id, image_url) VALUES 
(4, 'https://images.pexels.com/photos/2421467/pexels-photo-2421467.jpeg');

-- Product 14 (Review id 5)
INSERT INTO product_reviews (id, product_id, user_id, rating, content, is_verified_purchase) VALUES 
(5, 14, 1, 5, 'Very soft and premium feel. Highly recommended!', true); -- 4.6 làm tròn 5
INSERT INTO review_images (review_id, image_url) VALUES 
(5, 'https://images.pexels.com/photos/3094215/pexels-photo-3094215.jpeg');

-- Đồng bộ ID
SELECT setval('product_reviews_id_seq', (SELECT MAX(id) FROM product_reviews));
