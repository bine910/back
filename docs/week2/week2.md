# Tổng kết Tuần 2

Dưới đây là những nội dung đã thực hiện trong tuần 2, bao gồm việc thiết lập cơ sở dữ liệu và cấu hình môi trường cho project NestJS.

## 1. Setup Docker cho Database
- **Trạng thái:** Hoàn thành ✅
- **Kết quả:** Đã thiết lập `docker-compose.yml` để chạy container PostgreSQL.
- **Minh chứng:**
  ![Docker Compose chạy PostgreSQL](./assets/docker_postgres.png)

## 2. Cấu hình ConfigModule & Biến môi trường
- **Trạng thái:** Hoàn thành ✅
- **Ghi chú:** Không hardcode thông tin cấu hình trong code.
- **Nội dung:** Inject `ConfigService` để đọc các biến cấu hình từ file `.env`.
- **Kết quả:** Quản lý tham số kết nối an toàn linh hoạt qua biến môi trường.
- **Minh chứng:**
  ![ConfigModule và file .env](./assets/config_env.png)

## 3. Kết nối Database (TypeORM) bằng Async Provider
- **Trạng thái:** Hoàn thành ✅
- **Nội dung:** Kết nối tới cơ sở dữ liệu thông qua Async Provider dùng `useFactory`.
- **Kết quả:** Cấu hình thành công `TypeOrmModule` để kết nối vào PostgreSQL theo thông số từ biến môi trường.
- **Minh chứng:**
  ![Kết nối Database bằng TypeORM](./assets/db_connection.png)

## 4. Entity & Repository cơ bản
- **Trạng thái:** Hoàn thành ✅
- **Ghi chú:** Dùng `synchronize` cho môi trường dev hoặc migration cho production.
- **Nội dung:** Đã khai báo Entity tạo bảng `Product`.
- **Kết quả:** Xây dựng API tạo/lấy danh sách `Product` xử lý qua Repository cơ bản.
- **Minh chứng:**
  ![Entity Product và API](./assets/entity_repository.png)
