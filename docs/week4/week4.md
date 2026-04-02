# Tổng kết Tuần 4 – Bảo mật & Middleware

Dưới đây là những nội dung đã học và thực hành được trong tuần 4, với mục tiêu phân quyền, xác thực và bảo vệ an toàn cho API.

## 1. Authentication (Bcrypt + JWT)
- **Trạng thái:** Hoàn thành ✅
- **Ghi chú:** Dùng `Passport` và `JwtModule` được hỗ trợ sẵn từ NestJS.
- **Kết quả:** Route `/login` tạo và trả về JWT thành công; Các mật khẩu tạo mới đã được mã hóa an toàn ở database.
- **Minh chứng:**
  ![Authentication](./assets/authentication.png)

## 2. Bảo vệ API bằng Guards
- **Trạng thái:** Hoàn thành ✅
- **Ghi chú:** Đảm bảo chỉ người dùng đã đăng nhập mới xem được thông tin cá nhân.
- **Kết quả:** Tạo và sử dụng thành công `JwtAuthGuard` để chặn ngay lập tức vào api `/profile` khi request người dùng không gửi kèm theo token hợp lệ.
- **Minh chứng:**
  ![Guards](./assets/guards.png)

## 3. Triển khai Middleware
- **Trạng thái:** Hoàn thành ✅
- **Ghi chú:** Hook vào luồng đầu vào để ghi lại các thao tác, hành vi truy cập.
- **Kết quả:** Xây dựng `LoggerMiddleware` giúp tự động in ra màn hình console / terminal gồm: HTTP Method, đường dẫn URL, và thời gian truy cập.
- **Minh chứng:**
  ![Middleware](./assets/middleware.png)
