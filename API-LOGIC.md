# Globex — Phân tích logic từng module

> Mỗi dòng là 1 case cụ thể, ghi rõ điều kiện → kết quả.  
> Tất cả response của NestJS backend được bọc bởi `ResponseInterceptor`: `{ status: "success", data: ... }`

---

## Phần 1 — NestJS Backend (`/back`)

### 1. Auth — `/auth`

#### POST `/auth/register`

| # | Điều kiện | Kết quả | HTTP |
|---|-----------|---------|------|
| 1 | Email **chưa tồn tại** trong DB | Tạo user mới (role mặc định `CUSTOMER`), trả về `{ message, email, full_name, role, image }` | 201 |
| 2 | Email **đã tồn tại** trong DB | `BadRequestException`: "Email đã tồn tại" | 400 |

#### POST `/auth/login`

| # | Điều kiện | Kết quả | HTTP |
|---|-----------|---------|------|
| 1 | Email **không tồn tại** trong DB | `UnauthorizedException`: "Email không tồn tại" | 401 |
| 2 | Email tồn tại, password **sai** | `UnauthorizedException`: "Sai mật khẩu" | 401 |
| 3 | Email tồn tại, password **đúng** | Trả về `{ access_token }` — JWT payload: `{ id, email, role }` | 200 |

---

### 2. Products — `/products`

#### GET `/products/suggestions`

Điều kiện cơ sở: `p.is_active = true`, match theo `LOWER(name) LIKE 'keyword%'` (prefix, không phải contains).

| # | Điều kiện | Kết quả |
|---|-----------|---------|
| 1 | Có sản phẩm khớp keyword | Trả `ProductSuggestionDto[]`, tối đa `limit` item, sort `rating_avg DESC` rồi `created_at DESC` |
| 2 | Không có sản phẩm nào khớp | Trả mảng rỗng `[]` |

Trường mỗi item: `id, slug, name, thumbnail_url, base_price, discount_percent, final_price`

---

#### GET `/products/cards`

Mặc định: `page=1`, `limit=12`, `sortBy=created_at`, `sortOrder=DESC`. Điều kiện cơ sở: `p.is_active = true`.

**Filter áp dụng:**

| Filter | Khi nào áp dụng | Điều kiện SQL |
|--------|----------------|---------------|
| `minPrice` | Có truyền | `final_price >= minPrice` |
| `maxPrice` | Có truyền | `final_price <= maxPrice` |
| `minDiscount` | Có truyền | `p.discount_percent >= minDiscount` |
| `brandIds` | Có ít nhất 1 giá trị | `p.brand_id IN (...)` |
| `colors` | Có ít nhất 1 giá trị | `EXISTS (SELECT 1 FROM product_variants WHERE LOWER(color) IN (...))` |

**Sort:**

| `sortBy` | Sắp xếp chính | Sắp xếp phụ |
|----------|--------------|------------|
| `created_at` (mặc định) | `p.created_at sortOrder` | — |
| `final_price` | `final_price sortOrder` | `p.created_at DESC` |
| `rating_avg` | `rating_avg sortOrder` | `p.created_at DESC` |

**Phân trang:**

| # | Điều kiện | `total_pages` |
|---|-----------|---------------|
| 1 | `total = 0` | `0` |
| 2 | `total > 0` | `Math.ceil(total / limit)` |

Response: `{ items: ProductCardDto[], pagination: { page, limit, total, total_pages } }`

---

#### GET `/products/trending`

| # | Điều kiện | Kết quả |
|---|-----------|---------|
| 1 | Luôn | Trả tối đa **5** `ProductCardDto`, chỉ `is_active = true`, sort `rating_avg DESC` rồi `created_at DESC` |

---

#### GET `/products/filters`

Áp dụng cùng filter như `/products/cards` để giới hạn phạm vi trước khi tính facets.

| Trường trả về | Nguồn dữ liệu |
|---------------|--------------|
| `price_range.min` | `MIN(final_price)` trong phạm vi, mặc định `0` nếu không có sản phẩm |
| `price_range.max` | `MAX(final_price)` trong phạm vi, mặc định `0` nếu không có sản phẩm |
| `brands[]` | Brand có ít nhất 1 sản phẩm trong phạm vi; sort `count DESC` rồi `name ASC` |
| `colors[]` | Màu từ `product_variants` (lowercase, distinct); sort `count DESC` rồi `value ASC` |
| `discount_buckets[0]` | key `0-10`: `discount_percent BETWEEN 0 AND 9` |
| `discount_buckets[1]` | key `10-20`: `discount_percent BETWEEN 10 AND 19` |
| `discount_buckets[2]` | key `20-30`: `discount_percent BETWEEN 20 AND 29` |
| `discount_buckets[3]` | key `30-50`: `discount_percent BETWEEN 30 AND 49` |
| `discount_buckets[4]` | key `50+`: `discount_percent >= 50` |
| `total_matching` | `COUNT(DISTINCT p.id)` trong phạm vi |

---

#### GET `/products/:id/open-page`

| # | Điều kiện | Kết quả | HTTP |
|---|-----------|---------|------|
| 1 | `id` hợp lệ, `is_active = true` | Trả `ProductOpenPageResponseDto` đầy đủ | 200 |
| 2 | `id` không tìm thấy hoặc `is_active = false` | `NotFoundException`: "Product with ID {id} not found" | 404 |

**Cấu trúc response khi thành công:**

| Nhóm field | Nội dung |
|-----------|---------|
| `product` | `id, slug, name, description, brand_name, base_price, final_price, discount_percent, rating_avg, rating_count` |
| `media_and_options.images` | Sort theo `display_order ASC` |
| `media_and_options.available_sizes` | Unique, sort thứ tự `XXS→XS→S→M→L→XL→XXL→XXXL`; size không nhận dạng được xếp cuối theo `localeCompare` |
| `media_and_options.available_colors` | Unique, sort `localeCompare ASC` |
| `tabs.product_details` | Từ `product.extra.product_details` (JSONB), flatten thành `Record<string, string>` |
| `tabs.specifications` | Từ `product.extra.specifications` (JSONB), cùng kiểu |
| `related_sections.similar_products` | Quan hệ type `SIMILAR`, sort `sort_order ASC` rồi `created_at DESC` |
| `related_sections.customer_also_like` | Quan hệ type `CUSTOMER_ALSO_LIKE`, cùng sort |
| `reviews.items` | Sort `created_at DESC` |
| `reviews.summary.rating_avg` | Trung bình rating, làm tròn 1 chữ số; `0` nếu chưa có review |
| `reviews.summary.rating_count` | Số lượng review; `0` nếu chưa có |

**Công thức `final_price`:** `ROUND(base_price * (100 - discount_percent) / 100, 2)`

---

#### GET `/products/:id`

| # | Điều kiện | Kết quả | HTTP |
|---|-----------|---------|------|
| 1 | `id` tồn tại | Trả `Product` entity kèm relations `images, variants, category, brand, reviews` | 200 |
| 2 | `id` không tồn tại | `NotFoundException`: "Product with ID {id} not found" | 404 |

---

### 3. Cart — `/cart`

> Tất cả endpoint yêu cầu JWT (`Authorization: Bearer <token>`). Không có token → 401.

#### POST `/cart`

| # | Điều kiện | Kết quả | HTTP |
|---|-----------|---------|------|
| 1 | `product_variant_id` **không tồn tại** | `NotFoundException`: "Variant sản phẩm với ID {id} không tồn tại" | 404 |
| 2 | Variant tồn tại, user **chưa có** item này trong giỏ | Tạo `CartItem` mới với `quantity = dto.quantity ?? 1` | 201 |
| 3 | Variant tồn tại, user **đã có** item này trong giỏ | Cộng dồn `existing.quantity += dto.quantity ?? 1`, trả về item đã cập nhật | 201 |

---

### 4. Wishlist — `/wishlist`

> Tất cả endpoint yêu cầu JWT. Không có token → 401.

#### POST `/wishlist`

| # | Điều kiện | Kết quả | HTTP |
|---|-----------|---------|------|
| 1 | `product_id` **không tồn tại** trong DB | `NotFoundException`: "Sản phẩm với ID {id} không tồn tại" | 404 |
| 2 | Sản phẩm tồn tại, user **chưa** thêm vào wishlist | Tạo `Wishlist` mới | 201 |
| 3 | Sản phẩm tồn tại, user **đã** thêm vào wishlist | `ConflictException`: "Sản phẩm đã có trong wishlist" | 409 |

#### GET `/wishlist`

| # | Điều kiện | Kết quả |
|---|-----------|---------|
| 1 | User không có sản phẩm nào trong wishlist | Trả mảng rỗng `[]` |
| 2 | User có sản phẩm trong wishlist | Trả `ProductCardDto[]`, chỉ `p.is_active = true`, sort `w.created_at DESC` |

---

### 5. Quy tắc chung Backend

#### Bảo vệ endpoint (JWT Guard)

| Module | Endpoint | Yêu cầu JWT |
|--------|----------|------------|
| Auth | `POST /auth/register`, `POST /auth/login` | Không |
| Product | Tất cả | Không |
| Cart | `POST /cart` | Có |
| Wishlist | `POST /wishlist`, `GET /wishlist` | Có |

#### `rating_avg` và `rating_count` trong `ProductCardDto`

| Điều kiện | `rating_avg` | `rating_count` |
|-----------|-------------|----------------|
| Chưa có review nào | `0` | Field bị bỏ qua (undefined) trong `ProductCardDto` |
| Có ít nhất 1 review | Trung bình, làm tròn 1 chữ số | Số lượng review (hiện diện trong object) |

---

## Phần 2 — MCP Server (`/react-mcp`)

MCP server read-only, đọc repo **`dangle10/react`** qua **GitHub REST API** (không clone, không `fs`).  
Chạy qua stdio: `npm start` (`node src/index.js`).

### Giới hạn rate limit GitHub API

| Trường hợp | Rate limit |
|-----------|-----------|
| Không có token | **60 requests/giờ** (tính theo IP) |
| Có `GITHUB_PERSONAL_ACCESS_TOKEN` hoặc `GITHUB_TOKEN` | **5.000 requests/giờ** |

> Khuyến nghị set token khi dùng `get_todo_comments` vì tool này gọi API nhiều lần (1 call/file).

---

### Tool: Git (`tools/git.js`)

#### `get_components` — Liệt kê branches

| # | Điều kiện | Kết quả |
|---|-----------|---------|
| 1 | API thành công | Trả `string[]` tên các branch |
| 2 | API lỗi | Trả `{ error: "<message>" }`, `isError: true` |

#### `get_commit_history` — Lịch sử commit

Input: `branch` (mặc định `"main"`), `limit` (mặc định `10`, max `100`).

| # | Điều kiện | Kết quả |
|---|-----------|---------|
| 1 | API thành công | Trả `{ sha, message, author, date }[]` — `message` chỉ lấy dòng đầu tiên |
| 2 | Branch không tồn tại hoặc API lỗi | Trả `{ error: "<message>" }`, `isError: true` |

#### `get_diff` — So sánh 2 ref

Input: `base` (branch/SHA), `head` (branch/SHA).

| # | Điều kiện | Kết quả |
|---|-----------|---------|
| 1 | API thành công | Trả `{ status, ahead_by, behind_by, total_commits, files[], total_additions, total_deletions }` |
| 2 | Ref không hợp lệ hoặc API lỗi | Trả `{ error: "<message>" }`, `isError: true` |

Mỗi file trong `files[]`: `{ path, status, additions, deletions }`

---

### Tool: Components (`tools/components.js`)

Tất cả đọc từ branch `main`. Fetch file qua `GET /contents/{path}` (base64-decoded).

#### `get_component_list` — Danh sách file component

| # | Điều kiện | Kết quả |
|---|-----------|---------|
| 1 | API thành công | Trả `string[]` path của file `.js`/`.jsx` dưới `src/components/` và `src/pages/`, sort ASC |
| 2 | API lỗi | Trả `{ error: "<message>" }`, `isError: true` |

#### `get_component_code` — Lấy source code

Input: `path` (ví dụ: `"src/components/Button.jsx"`).

| # | Điều kiện | Kết quả |
|---|-----------|---------|
| 1 | File tồn tại, API thành công | Trả `{ path, code }` — nội dung đã decode từ base64 |
| 2 | File không tồn tại hoặc API lỗi | Trả `{ error: "<message>" }`, `isError: true` |

Nếu GitHub trả encoding không phải `base64`: fallback fetch qua `download_url`.

#### `detect_component_type` — Phát hiện loại component

Input: `path`.

| # | Điều kiện code | Loại trả về |
|---|---------------|------------|
| 1 | Có `class XYZ extends React.Component` hoặc `extends PureComponent` | `"class"` |
| 2 | Có `function useXxx(` hoặc `const useXxx =` | `"hook"` |
| 3 | Có `function XYZ(` (PascalCase) | `"functional"` |
| 4 | Có `const XYZ = (` hoặc `const XYZ = ({` dạng arrow | `"arrow functional"` |
| 5 | Không khớp pattern nào | `"unknown"` |
| 6 | API lỗi | Trả `{ error: "<message>" }`, `isError: true` |

**Ưu tiên kiểm tra:** `class` → `hook` → `functional` → `arrow functional` → `unknown`

#### `get_component_props` — Trích xuất props (best-effort)

Input: `path`. Chỉ nhận diện props **destructure** trong signature.

| # | Pattern signature | Props trích xuất |
|---|------------------|-----------------|
| 1 | `export default function Foo({ a, b, c })` | `["a", "b", "c"]` |
| 2 | `const Foo = ({ a, b }) =>` | `["a", "b"]` |
| 3 | Props lồng nhau hoặc default value: `{ a = 1, b: { x } }` | Chỉ lấy tên ngoài cùng: `["a", "b"]` |
| 4 | Rest props: `...rest` | Giữ `"...rest"` |
| 5 | Không dùng destructure (ví dụ: `function Foo(props)`) | Trả mảng rỗng `[]` |
| 6 | API lỗi | Trả `{ error: "<message>" }`, `isError: true` |

---

### Tool: Quality (`tools/quality.js`)

#### `get_todo_comments` — Quét TODO/FIXME

Quét toàn bộ `src/**/*.js` và `src/**/*.jsx`. Delay **150ms** giữa mỗi file (configurable qua `MCP_GITHUB_DELAY_MS`).

| # | Điều kiện | Kết quả |
|---|-----------|---------|
| 1 | Quét xong, không có lỗi | `{ matches: [...], fetchFailures: [] }` |
| 2 | Quét xong, một số file không fetch được | `{ matches: [...], fetchFailures: [{ file, error }] }` — file lỗi không tính là không có comment |
| 3 | Lỗi ngay từ đầu (lấy tree thất bại) | Trả `{ error: "<message>" }`, `isError: true` |

Mỗi match trong `matches[]`: `{ file, line, type: "TODO" | "FIXME", text }`

**Nhận diện pattern:**

| Pattern | Loại |
|---------|------|
| `// TODO ...` hoặc `/* TODO ...` (case-insensitive) | `"TODO"` |
| `// FIXME ...` hoặc `/* FIXME ...` (case-insensitive) | `"FIXME"` |

---

### Cấu hình MCP Server trong Cursor / VS Code

File `.cursor/mcp.json` hoặc `.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "react-mcp": {
      "command": "node",
      "args": ["C:/Code/hoc3/react-mcp/src/index.js"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."
      }
    }
  }
}
```

Token là tùy chọn nhưng **khuyến nghị** khi dùng `get_todo_comments`.
