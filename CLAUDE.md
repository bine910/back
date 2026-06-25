# Clothing Shop — NestJS Backend

## Vai trò

Tôi là backend developer (Bình). Đăng code frontend React (repo `dangle10/react`).
Tôi code NestJS backend ở repo riêng, cung cấp REST API cho frontend.

## Tech Stack Backend

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: ( PostgreSQL )
- **Auth**: JWT (passport-jwt)
- **Validation**: class-validator + class-transformer
- **ORM**: TypeORM hoặc Prisma

## MCP Server `react-mcp`

Tôi có MCP server read-only kết nối tới repo frontend `dangle10/react`.
Mục đích: **đọc code frontend để biết FE đang gọi API gì, cần data gì, rồi code backend cho khớp.**

## Rules — BẮT BUỘC

1. **TRƯỚC KHI tạo endpoint mới** → chạy `get_component_code` đọc component/page FE liên quan để biết FE đang fetch URL nào, gửi body gì, expect response gì
2. **TRƯỚC KHI thiết kế response DTO** → chạy `get_component_props` xem FE component cần những field nào → response phải chứa đúng các field đó
3. **Khi không biết FE có những page/feature nào** → chạy `get_component_list` để xem toàn bộ cấu trúc
4. **Khi cần biết FE thay đổi gì gần đây** → chạy `get_commit_history` hoặc `get_diff`
5. **KHÔNG ĐƯỢC đoán** FE đang gọi endpoint nào — luôn đọc code FE thực tế qua MCP tools

## Workflow chuẩn

```
1. get_component_list          → xem FE có những page/component nào
2. get_component_code(page)    → đọc code page, tìm fetch/axios calls
3. Xác định: endpoint URL, method, request body, expected response
4. Code NestJS: controller → service → entity/DTO → database
5. get_diff("main", "feature") → kiểm tra FE có thay đổi API calls không
```