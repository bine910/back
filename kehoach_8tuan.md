# internship-project-bine910
internship-project-bine910 created by GitHub Classroom
# Thực tập Cơ sở – Kế hoạch & Tiến độ 08 Tuần

---

## 1. Thông tin sinh viên
- Họ tên:Hà Đình Bình
- MSSV:B23DCVT051
- Lớp:D23CQCE03-B
- Email:hdbinh2005@gmail.com
- GitHub username:bine910

---

## 2. Đăng ký chủ đề thực tập
**Định hướng (roadmap.sh):**
- [] Cải thiện / tập trung vào một kỹ năng
- [x] Kỹ năng mới / trend
- [] Nghiên cứu / đề tài / dự án

**1–3 kỹ năng chính:**Backend-Nodejs,vibe-coding bằng antigravity,docker  
 

**Bài toán / nội dung áp dụng cụ thể:**
Xây dựng hệ thống Backend (RESTful API) cho website thương mại điện tử kinh doanh thời trang "Globex". Hệ thống cung cấp các API quản lý người dùng, sản phẩm, bộ lọc tìm kiếm, giỏ hàng, và đơn hàng. Áp dụng công nghệ Containerization (Docker) để triển khai và quy trình "vibe-coding" bằng Google AntiGravity để tối ưu hóa tốc độ và chất lượng mã nguồn.

Link GitHub repository (nếu có): https://github.com/bine910/ttcs 
Làm việc nhóm (nếu có):
Lê Hải Đăng - B23DCVT072 - front-end
---

## 3. Kế hoạch thực hiện 08 tuần

> Mỗi tuần: **2–4 nhiệm vụ cụ thể**, có **kết quả đầu ra rõ ràng**  
> (file / link / screenshot / demo URL)

### Tuần 1 – Nền tảng Kiến trúc NestJS (Fundamentals & Dependency Injection)
Mục tiêu: Hiểu luồng dữ liệu và cách NestJS quản lý module, IoC.

| Nhiệm vụ | Trạng thái | Kết quả đầu ra (Demo/Proof of Concept) | Ghi chú |
|---------|-----------|---------------|--------|
| Khởi tạo project & Cấu trúc thư mục chuẩn | [ ] / [x] | Source code rỗng trên Github | Dùng Nest CLI |
| Học Controllers & Routing | [ ] / [x] | API /ping trả về text cơ bản để test Postman | |
| Học Providers & Dependency Injection | [ ] / [x] | ProductSerVice inject vào ProductController xử lý CRUD với mảng ảo | Tránh viết logic trong Controller |
| Học Modules | [ ] / [x] | Tách UserModule và ProductModule, export service chéo | Hiểu tính đóng gói |

---

### Tuần 2 – Database & Cấu hình môi trường
Mục tiêu: Kết nối DB và quản lý biến môi trường.

| Nhiệm vụ | Trạng thái | Kết quả đầu ra | Ghi chú |
|---------|-----------|---------------|--------|
| Setup Docker cho Database | [ ] / [x] | docker-compose.yml chạy container PostgreSQL | |
| Cấu hình ConfigModule & Biến môi trường | [ ] / [x] | Inject ConfigService đọc .env | Không hardcode |
| Kết nối Database (TypeORM) bằng Async Provider | [ ] / [x] | Module kết nối DB thành công dùng useFactory | |
| Entity & Repository cơ bản | [ ] / [x] | Tạo bảng User và API tạo/lấy danh sách User | Dùng migration hoặc sync (dev) |

---

### Tuần 3 – Xác thực Dữ liệu & Xử lý Lỗi
Mục tiêu: Đảm bảo dữ liệu đầu vào sạch và chuẩn hóa phản hồi lỗi.

| Nhiệm vụ | Trạng thái | Kết quả đầu ra | Ghi chú |
|---------|-----------|---------------|--------|
| Validation với DTO & Pipes | [ ] / [x] | class-validator: lỗi nếu email sai hoặc password ngắn | |
| Xử lý ngoại lệ (Exception Filters) | [ ] / [x] | Custom filter trả JSON chuẩn khi not found | |
| Interceptors (Response Transformation) | [ ] / [x] | Interceptor bọc response thành { data, status } | |

---

### Tuần 4 – Bảo mật & Middleware
Mục tiêu: Phân quyền và bảo vệ API.

| Nhiệm vụ | Trạng thái | Kết quả đầu ra | Ghi chú |
|---------|-----------|---------------|--------|
| Authentication (Bcrypt + JWT) | [ ] / [x] | /login trả về JWT; password mã hóa | Dùng Passport/JwtModule |
| Bảo vệ API bằng Guards | [ ] / [x] | JwtAuthGuard chặn /profile nếu không có token | |
| Triển khai Middleware | [ ] / [x] | LoggerMiddleware in ra Method, URL, Time | |

---

### Tuần 5 – Bắt đầu làm Product
Mục tiêu: Áp dụng kiến thức để code nghiệp vụ lõi.

| Nhiệm vụ | Trạng thái | Kết quả đầu ra | Ghi chú |
|---------|-----------|---------------|--------|
| Thiết kế CSDL hoàn chỉnh (ERD) | [ ] / [x] | Ảnh ERD chốt | |
| API Quản lý Danh mục & Sản phẩm (CRUD) | [ ] / [x] | API trả về danh sách sản phẩm từ Postgres | DTO + Exception Filter |
| API Bộ lọc & Tìm kiếm | [ ] / [x] | Lọc theo query params (giá, size, màu) | |
| Seed dữ liệu mẫu | [ ] / [x] | Script bơm dữ liệu demo vào DB | |

---

### Tuần 6 – Tích hợp Frontend & Luồng mua sắm
Mục tiêu: Hỗ trợ frontend và hoàn thiện luồng mua hàng.

| Nhiệm vụ | Trạng thái | Kết quả đầu ra | Ghi chú |
|---------|-----------|---------------|--------|
| Hỗ trợ Frontend (CORS, docs) | [ ] / [x] | Frontend hiển thị Home/Product từ API | CORS enabled |
| API Giỏ hàng (Cart) | [ ] / [x] | Thêm, sửa số lượng, xóa sản phẩm trong cart | |
| API Wishlist (Yêu thích) | [ ] / [x] | Lưu sản phẩm user yêu thích | Dùng JwtAuthGuard |

---

### Tuần 7 – Đặt hàng, Đóng gói & Tài liệu
| Nhiệm vụ | Trạng thái | Kết quả đầu ra | Ghi chú |
|---------|-----------|---------------|--------|
| API Đặt hàng (Checkout) & Lịch sử | [ ] / [x] | Tạo Order, cập nhật trạng thái đơn | |
| Tích hợp Swagger / OpenAPI | [ ] / [x] | /api/docs hiển thị toàn bộ API | |
| Đóng gói Docker cả Backend & DB | [ ] / [x] | docker-compose up chạy được toàn hệ thống | |

---

### Tuần 8 – Tổng kết
| Nhiệm vụ | Trạng thái | Kết quả đầu ra | Ghi chú |
|---------|-----------|---------------|--------|
| Review code & Refactor | [ ] / [x] | Code sạch, xử lý edge-cases | Vibe-coding |
| Demo / Báo cáo | [ ] / [x] | Demo URL / Report / Video | Buổi trao đổi 4 |

---

## 4. Checklist & Tổng kết
- [ ] Tham gia đủ **04 buổi trao đổi**
- [ ] Có cập nhật tiến độ định kỳ
- [ ] Kết quả cuối chạy được / demo được

**Tự đánh giá mức độ hoàn thành:** …… %  
**Vướng mắc / nội dung cần giảng viên hỗ trợ:** 
