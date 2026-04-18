# internship-project-bine910
internship-project-bine910 created by GitHub Classroom
# Thực tập Cơ sở – Kế hoạch & Tiến độ 10 Tuần

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

**1–3 kỹ năng chính:**Backend-Nodejs,vibe-coding ,docker  
 

**Bài toán / nội dung áp dụng cụ thể:**
Xây dựng hệ thống Backend (RESTful API) cho website thương mại điện tử kinh doanh thời trang "Globex". Hệ thống cung cấp các API quản lý người dùng, sản phẩm, bộ lọc tìm kiếm, giỏ hàng, và đơn hàng. Áp dụng công nghệ Containerization (Docker) để triển khai và quy trình "vibe-coding" bằng Google AntiGravity để tối ưu hóa tốc độ và chất lượng mã nguồn.

Link GitHub repository (nếu có): https://github.com/bine910/ttcs 
Làm việc nhóm (nếu có):
Lê Hải Đăng - B23DCVT072 - front-end
---

## 3. Kế hoạch thực hiện 10 tuần

> Mỗi tuần: **2–4 nhiệm vụ cụ thể**, có **kết quả đầu ra rõ ràng**  
> (file / link / screenshot / demo URL)

### Tuần 1 – Nền tảng Kiến trúc NestJS (Fundamentals & Dependency Injection)
Mục tiêu: Hiểu luồng dữ liệu và cách NestJS quản lý module, IoC.

| Nhiệm vụ | Trạng thái | Kết quả đầu ra (Demo/Proof of Concept) | Ghi chú |
|---------|-----------|---------------|--------|
| Khởi tạo project & Cấu trúc thư mục chuẩn | [x] / [x] | [Báo cáo Tuần 1](./docs/week1/week1.md) | Dùng Nest CLI |
| Học Controllers & Routing | [x] / [x] | [Báo cáo Tuần 1](./docs/week1/week1.md) | |
| Học Providers & Dependency Injection | [x] / [x] | [Báo cáo Tuần 1](./docs/week1/week1.md) | Tránh viết logic trong Controller |
| Học Modules | [x] / [x] | [Báo cáo Tuần 1](./docs/week1/week1.md) | Hiểu tính đóng gói |

---

### Tuần 2 – Database & Cấu hình môi trường
Mục tiêu: Kết nối DB và quản lý biến môi trường.

| Nhiệm vụ | Trạng thái | Kết quả đầu ra | Ghi chú |
|---------|-----------|---------------|--------|
| Setup Docker cho Database | [x] / [x] | [Báo cáo Tuần 2](./docs/week2/week2.md) | |
| Cấu hình ConfigModule & Biến môi trường | [x] / [x] | [Báo cáo Tuần 2](./docs/week2/week2.md) | Không hardcode |
| Kết nối Database (TypeORM) bằng Async Provider | [x] / [x] | [Báo cáo Tuần 2](./docs/week2/week2.md) | |
| Entity & Repository cơ bản | [x] / [x] | [Báo cáo Tuần 2](./docs/week2/week2.md) | Dùng migration hoặc sync (dev) |

---

### Tuần 3 – Xác thực Dữ liệu & Xử lý Lỗi
Mục tiêu: Đảm bảo dữ liệu đầu vào sạch và chuẩn hóa phản hồi lỗi.

| Nhiệm vụ | Trạng thái | Kết quả đầu ra | Ghi chú |
|---------|-----------|---------------|--------|
| Validation với DTO & Pipes | [x] / [x] | [Báo cáo Tuần 3](./docs/week3/week3.md) | |
| Xử lý ngoại lệ (Exception Filters) | [x] / [x] | [Báo cáo Tuần 3](./docs/week3/week3.md) | |
| Interceptors (Response Transformation) | [x] / [x] | [Báo cáo Tuần 3](./docs/week3/week3.md) | |

---

### Tuần 4 – Bảo mật & Middleware
Mục tiêu: Phân quyền và bảo vệ API.

| Nhiệm vụ | Trạng thái | Kết quả đầu ra | Ghi chú |
|---------|-----------|---------------|--------|
| Authentication (Bcrypt + JWT) | [x] / [x] | [Báo cáo Tuần 4](./docs/week4/week4.md) | Dùng Passport/JwtModule |
| Bảo vệ API bằng Guards | [x] / [x] | [Báo cáo Tuần 4](./docs/week4/week4.md) | |
| Triển khai Middleware | [x] / [x] | [Báo cáo Tuần 4](./docs/week4/week4.md) | |

---

### Tuần 5 – Quản lý Ngữ cảnh & Tiêu chuẩn hóa với Agent Skills
Mục tiêu: Áp dụng tiêu chuẩn Agent Skills để đóng gói các quy tắc lập trình NestJS, giúp tối ưu hóa giới hạn Token và định hướng AI luôn code chuẩn theo kiến trúc dự án.

| Nhiệm vụ | Trạng thái | Kết quả đầu ra | Ghi chú |
|---------|-----------|---------------|--------|
| Định nghĩa Bộ Kỹ năng (Agent Skills) cho Backend | [x] / [x] | [Báo cáo Tuần 5](./docs/week5/week5.md) — `.cursor/rules/*.mdc` (Clean Architecture, REST API, unit test, code review). | Đảm bảo AI không sinh code rác hoặc sai convention. |
| Tối ưu hóa Token & Quản lý Context (Load on-demand) | [x] / [x] | [Báo cáo Tuần 5](./docs/week5/week5.md) — bảng so sánh ước lượng tải ngữ cảnh gộp vs tách skill. | Tránh lỗi AI bị "quên" context khi vượt quá giới hạn token (VD: 176k của Opus). |
| Đóng gói Workflow tự động hóa bằng Script | [x] / [x] | [Báo cáo Tuần 5](./docs/week5/week5.md) — `scripts/verify-backend.*` + hook `stop` trong `.cursor/hooks.json`. | |

---

### Tuần 6 – Tích hợp Hệ thống ngoài & Tự động hóa với MCP (Model Context Protocol)
Mục tiêu: Kết nối Cursor (AI Agent) với các công cụ quản lý mã nguồn (GitHub) để tạo ra một luồng làm việc khép kín không cần chuyển đổi ứng dụng.

| Nhiệm vụ | Trạng thái | Kết quả đầu ra | Ghi chú |
|---------|-----------|---------------|--------|
| Cài đặt & Cấu hình MCP Server cho IDE | [x] / [x] | [Báo cáo Tuần 6](./docs/week6/week6.md) + [`mcp-github.example.json`](./docs/week6/mcp-github.example.json) (GitHub MCP + PAT). | Setup hạ tầng giao tiếp cho AI. |
| Workflow đẩy code tự động (AI Git Management) | [x] / [x] | [Báo cáo Tuần 6](./docs/week6/week6.md) — quy trình branch / commit / push qua Agent + MCP hoặc shell. | Hoàn thiện quy trình Vibe-coding end-to-end. |

---

### Tuần 7 – Bắt đầu làm Product
Mục tiêu: Áp dụng kiến thức để code nghiệp vụ lõi.

| Nhiệm vụ | Trạng thái | Kết quả đầu ra | Ghi chú |
|---------|-----------|---------------|--------|
| Thiết kế CSDL hoàn chỉnh (ERD) | [ ] / [x] | Ảnh ERD chốt | |
| API Quản lý Danh mục & Sản phẩm (CRUD) | [ ] / [x] | API trả về danh sách sản phẩm từ Postgres | DTO + Exception Filter |
| API Bộ lọc & Tìm kiếm | [ ] / [x] | Lọc theo query params (giá, size, màu) | |
| Seed dữ liệu mẫu | [ ] / [x] | Script bơm dữ liệu demo vào DB | |

---

### Tuần 8 – Tích hợp Frontend & Luồng mua sắm
Mục tiêu: Hỗ trợ frontend và hoàn thiện luồng mua hàng.

| Nhiệm vụ | Trạng thái | Kết quả đầu ra | Ghi chú |
|---------|-----------|---------------|--------|
| Hỗ trợ Frontend (CORS, docs) | [ ] / [x] | Frontend hiển thị Home/Product từ API | CORS enabled |
| API Giỏ hàng (Cart) | [ ] / [x] | Thêm, sửa số lượng, xóa sản phẩm trong cart | |
| API Wishlist (Yêu thích) | [ ] / [x] | Lưu sản phẩm user yêu thích | Dùng JwtAuthGuard |

---

### Tuần 9 – Đặt hàng, Đóng gói & Tài liệu
| Nhiệm vụ | Trạng thái | Kết quả đầu ra | Ghi chú |
|---------|-----------|---------------|--------|
| API Đặt hàng (Checkout) & Lịch sử | [ ] / [x] | Tạo Order, cập nhật trạng thái đơn | |
| Tích hợp Swagger / OpenAPI | [ ] / [x] | /api/docs hiển thị toàn bộ API | |
| Đóng gói Docker cả Backend & DB | [ ] / [x] | docker-compose up chạy được toàn hệ thống | |

---

### Tuần 10 – Tổng kết
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
