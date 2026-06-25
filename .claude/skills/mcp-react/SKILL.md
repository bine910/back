---
name: react-mcp-for-backend
description: >
  Skill dành cho backend developer dùng MCP tools để đọc code frontend React (repo dangle10/react),
  từ đó xác định FE cần những API endpoints nào, request/response format ra sao, rồi xây NestJS
  backend cho khớp. Trigger khi: tạo controller/service/DTO mới, thiết kế API endpoint, cần biết
  FE gọi API gì, cần biết FE expect response format nào, kiểm tra FE có thay đổi API calls không,
  hoặc bất kỳ lúc nào cần hiểu frontend đang cần gì từ backend. Cũng trigger khi nghe: "tạo API",
  "endpoint cho", "FE cần gì", "response trả về gì", "DTO cho", "Đăng code gì rồi", "check FE".
---

# React MCP for Backend Developer

## Mục đích

Dùng MCP tools để **đọc code frontend của Đăng** → hiểu FE đang cần gì → code NestJS backend cho khớp.

## Khi nào dùng tool nào

### 1. "FE có những trang/feature gì?" → `get_component_list`

Chạy đầu tiên để nắm toàn cảnh. Từ kết quả, suy ra FE cần những nhóm API nào:

```
src/pages/Home.jsx          → GET /products (featured, categories)
src/pages/ProductDetail.jsx → GET /products/:id
src/pages/Cart.jsx          → GET /cart, POST /cart, DELETE /cart/:itemId
src/pages/Login.jsx         → POST /auth/login
src/pages/Register.jsx      → POST /auth/register
src/components/ProductCard.jsx → cần biết product object có field gì
```

### 2. "FE gọi API gì, body/response ra sao?" → `get_component_code`

Đọc code page FE, tìm các pattern:

```javascript
// Tìm trong code FE:
fetch(`${import.meta.env.VITE_API_URL}/products`)       → GET /products
fetch(`${...}/products/${id}`)                           → GET /products/:id
fetch(`${...}/cart`, { method: 'POST', body: ... })      → POST /cart
axios.get('/products', { params: { category } })         → GET /products?category=...
```

**Cách đọc**: Khi thấy FE code `setProducts(data)` rồi render `product.name`, `product.price`, `product.image` → response của `GET /products` phải trả về array với các field đó.

### 3. "Component này cần data gì?" → `get_component_props`

Xem component nhận props gì → đó là các field mà API response cần có:

```
get_component_props("src/components/ProductCard.jsx")
→ props: [name, price, image, category, onAddToCart]
→ Nghĩa là Product entity cần có: name, price, image, category
```

### 4. "Đăng commit gì gần đây? Có thay đổi API không?" → `get_commit_history` + `get_diff`

```
get_commit_history(branch: "main", limit: 5)
→ Xem Đăng vừa push gì

get_diff(base: "main", head: "feature/cart")
→ Xem branch cart thay đổi file nào, có thêm API call mới không
```

Sau khi thấy FE có file thay đổi → dùng `get_component_code` đọc file đó → check có endpoint mới cần làm không.

### 5. "Có TODO nào liên quan API không?" → `get_todo_comments`

Tìm comment kiểu `// TODO: call API for ...` trong code FE → biết feature nào FE đang chờ BE.

## Workflow: Từ đọc FE → code NestJS

### Bước 1: Đọc FE page
```
get_component_code("src/pages/ProductDetail.jsx")
```

### Bước 2: Phân tích API calls trong code FE
Tìm các dòng fetch/axios → xác định:
- **URL**: `/products/${id}` → endpoint `GET /products/:id`
- **Method**: GET
- **Body**: không có (GET request)
- **Response expected**: nhìn vào cách FE dùng data → `data.name`, `data.price`, `data.images`, `data.sizes`

### Bước 3: Code NestJS cho khớp

**DTO (response):**
```typescript
// dto/product-response.dto.ts
export class ProductResponseDto {
  id: number;
  name: string;           // ← FE dùng data.name
  price: number;          // ← FE dùng data.price
  images: string[];       // ← FE dùng data.images
  sizes: string[];        // ← FE dùng data.sizes
  category: string;
  description: string;
}
```

**Controller:**
```typescript
// products/products.controller.ts
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query('category') category?: string) {
    return this.productsService.findAll(category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }
}
```

**Service:**
```typescript
// products/products.service.ts
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  findAll(category?: string) {
    const where = category ? { category } : {};
    return this.productRepo.find({ where });
  }

  findOne(id: number) {
    return this.productRepo.findOneOrFail({ where: { id } });
  }
}
```

## Checklist khi tạo endpoint mới

- [ ] Đã đọc code FE page liên quan qua `get_component_code`?
- [ ] Đã xác định đúng URL, method, body, response format?
- [ ] Response DTO có đủ các field mà FE đang dùng?
- [ ] Tên field khớp chính xác (FE dùng `image` thì BE không trả `imageUrl`)?
- [ ] Có handle error cases mà FE đang catch?