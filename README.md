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

Link GitHub repository (nếu có):
- **Back-end:** https://github.com/bine910/back


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

### Tuần 7 – Cấu hình AI-Assisted Development với Claude Code & MCP
Mục tiêu: Thiết lập bộ công cụ AI chuyên biệt để đọc code FE và đảm bảo backend code đúng theo yêu cầu frontend trước khi bắt đầu làm Product.

| Nhiệm vụ | Trạng thái | Kết quả đầu ra | Ghi chú |
|---------|-----------|---------------|--------|
| Xây dựng MCP Server `react-mcp` đọc repo FE | [x] / [x] | [`react-mcp/`](https://github.com/bine910/back/tree/main/react-mcp) — MCP server read-only kết nối repo `dangle10/react`, cung cấp tools: `get_component_list`, `get_component_code`, `get_component_props`, `get_diff`, `get_commit_history`. | Cho phép AI đọc trực tiếp code FE mà không cần chuyển repo. |
| Định nghĩa Skill `react-mcp` cho Claude Code | [x] / [x] | [`.claude/skills/mcp-react/SKILL.md`](https://github.com/bine910/back/blob/main/.claude/skills/mcp-react/SKILL.md) — hướng dẫn AI khi nào dùng tool nào, workflow 5 bước từ đọc FE → code NestJS cho khớp. | Tự động trigger khi tạo endpoint/DTO mới. |
| Cấu hình `CLAUDE.md` — project instructions cho AI | [x] / [x] | [`CLAUDE.md`](https://github.com/bine910/back/blob/main/CLAUDE.md) — định nghĩa vai trò backend dev, rules bắt buộc đọc FE trước khi tạo endpoint, workflow chuẩn tích hợp MCP. | Đảm bảo AI không đoán API mà phải đọc code FE thực tế. |

---

### Tuần 8 – Bắt đầu làm Product
Mục tiêu: Áp dụng kiến thức để code nghiệp vụ lõi.

**Link Back-end:** https://github.com/bine910/back

| Nhiệm vụ | Trạng thái | Kết quả đầu ra | Ghi chú |
|---------|-----------|---------------|--------|
| Thiết kế CSDL hoàn chỉnh (ERD) | [x] / [x] | [18 entities: User, Product, ProductVariant, Order, Cart, Wishlist...](https://github.com/bine910/back/tree/main/back/src/entities) | TypeORM, PostgreSQL 15 |
| API Quản lý Danh mục & Sản phẩm (CRUD) | [x] / [x] | [product.controller.ts](https://github.com/bine910/back/blob/main/back/src/modules/product/product.controller.ts) — 8 endpoints (CRUD, cards, trending, suggestions, open-page) | DTO + ValidationPipe |
| API Bộ lọc & Tìm kiếm | [x] / [x] | [product-card-filter-query.dto.ts](https://github.com/bine910/back/blob/main/back/src/modules/product/dto/product-card-filter-query.dto.ts) — `GET /products/cards` lọc theo minPrice, maxPrice, brandIds, colors, minDiscount, sortBy, page | Phân trang + sắp xếp |
| Seed dữ liệu mẫu | [x] / [x] | [seed.sql](https://github.com/bine910/back/blob/main/back/seed.sql) (10 brands, 15 products + variants/images) · [seed-wishlist-cart.sql](https://github.com/bine910/back/blob/main/back/seed-wishlist-cart.sql) | Chạy qua TypeORM migration |

---

### Tuần 9 – Tích hợp Frontend & Luồng mua sắm
Mục tiêu: Hỗ trợ frontend và hoàn thiện luồng mua hàng.

| Nhiệm vụ | Trạng thái | Kết quả đầu ra | Ghi chú |
|---------|-----------|---------------|--------|
| Hỗ trợ Frontend (CORS, docs) | [x] / [x] | [main.ts](https://github.com/bine910/back/blob/main/back/src/main.ts) — CORS `*`, Swagger tại `/api` với Bearer Auth | Port 5000 |
| API Giỏ hàng (Cart) | [x] / [x] | [cart.controller.ts](https://github.com/bine910/back/blob/main/back/src/modules/cart/cart.controller.ts) — `GET /cart`, `POST /cart` (add/tăng SL), `DELETE /cart/:id` | JwtAuthGuard; trả về CartResponseDto |
| API Wishlist (Yêu thích) | [x] / [x] | [wishlist.controller.ts](https://github.com/bine910/back/blob/main/back/src/modules/wishlist/wishlist.controller.ts) — `POST /wishlist`, `POST /wishlist/remove`, `GET /wishlist` | JwtAuthGuard |

---

### Tuần 10 – Đặt hàng, Đóng gói & Tài liệu
| Nhiệm vụ | Trạng thái | Kết quả đầu ra | Ghi chú |
|---------|-----------|---------------|--------|
| API Đặt hàng (Checkout) & Lịch sử | [ ] / [x] | Entity đã thiết kế: [order.entity.ts](https://github.com/bine910/back/blob/main/back/src/entities/order.entity.ts), [order-item.entity.ts](https://github.com/bine910/back/blob/main/back/src/entities/order-item.entity.ts), [payment.entity.ts](https://github.com/bine910/back/blob/main/back/src/entities/payment.entity.ts) | Controller chưa implement |
| Tích hợp Swagger / OpenAPI | [x] / [x] | [main.ts – Swagger setup](https://github.com/bine910/back/blob/main/back/src/main.ts) — `/api` hiển thị toàn bộ endpoint, hỗ trợ Bearer JWT | Swagger DTOs đầy đủ |
| Đóng gói Docker cả Backend & DB | [x] / [x] | [docker-compose.yml](https://github.com/bine910/back/blob/main/docker-compose.yml) — PostgreSQL 15 Alpine, volume `back_postgres_data`, env từ `.env` | `docker-compose up` chạy được DB |

---

### Tuần 11 – Tổng kết
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
