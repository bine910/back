-- ==========================================
-- Seed: Wishlist & Cart cho 2 user mẫu
-- Yêu cầu: đã chạy seed.sql trước (users id=1,2 | products id=0-14 | product_variants đã có)
-- ==========================================

-- Xoá dữ liệu cũ (nếu chạy lại)
TRUNCATE TABLE cart_items CASCADE;
TRUNCATE TABLE wishlists CASCADE;

-- ==========================================
-- 1. WISHLIST
-- User 1 thích: sản phẩm 0, 2, 5, 8, 11
-- User 2 thích: sản phẩm 1, 3, 6, 9, 14
-- ==========================================
INSERT INTO wishlists (user_id, product_id) VALUES
-- User 1 (Nguyễn Văn A)
(1, 0),
(1, 2),
(1, 5),
(1, 8),
(1, 11),
-- User 2 (Trần Thị B)
(2, 1),
(2, 3),
(2, 6),
(2, 9),
(2, 14);

-- ==========================================
-- 2. CART ITEMS
-- Dùng subquery theo SKU để tránh sai ID variant
--
-- User 1 có 3 sản phẩm trong giỏ:
--   - Basic Cotton T-Shirt (White / M)     x2
--   - Graphic Printed Tee (Black / L)      x1
--   - Sport Dry-Fit Tee (Gray / XL)        x3
--
-- User 2 có 3 sản phẩm trong giỏ:
--   - Premium Black T-Shirt (Black / S)    x1
--   - Striped Casual Tee (Navy / M)        x2
--   - Vintage Wash Tee (Gray / L)          x1
-- ==========================================
INSERT INTO cart_items (user_id, product_variant_id, quantity) VALUES
-- User 1
(1, (SELECT id FROM product_variants WHERE sku = 'PROD-0-WHI-M'),  2),
(1, (SELECT id FROM product_variants WHERE sku = 'PROD-2-BLK-L'),  1),
(1, (SELECT id FROM product_variants WHERE sku = 'PROD-5-GRA-XL'), 3),
-- User 2
(2, (SELECT id FROM product_variants WHERE sku = 'PROD-1-BLK-S'),  1),
(2, (SELECT id FROM product_variants WHERE sku = 'PROD-6-NAV-M'),  2),
(2, (SELECT id FROM product_variants WHERE sku = 'PROD-9-GRA-L'),  1);
