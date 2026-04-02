# Tổng kết Tuần 3 – Xác thực Dữ liệu & Xử lý Lỗi

Dưới đây là những nội dung đã làm và học được trong tuần 3, tập trung vào mục tiêu đảm bảo dữ liệu đầu vào sạch và chuẩn hóa phản hồi lỗi.

## 1. Validation với DTO & Pipes
- **Trạng thái:** Hoàn thành ✅
- **Ghi chú:** Áp dụng `class-validator` và `class-transformer` để kiểm tra tính hợp lệ của dữ liệu.
- **Kết quả:** Báo lỗi bad request nếu định dạng email sai hoặc password quá ngắn.
- **Minh chứng:**
  ![Validation](./assets/validation.png)

## 2. Xử lý ngoại lệ (Exception Filters)
- **Trạng thái:** Hoàn thành ✅
- **Ghi chú:** Gom cụm xử lý lỗi ở duy nhất một nơi tránh lặp lại code.
- **Kết quả:** Filter sẽ bắt và format lại lỗi dưới dạng một JSON chuẩn (ví dụ khi gọi đường dẫn không tồn tại / id báo not found).
- **Minh chứng:**
  ![Exception Filter](./assets/exception_filter.png)

## 3. Interceptors (Response Transformation)
- **Trạng thái:** Hoàn thành ✅
- **Ghi chú:** Can thiệp vào luồng response trước khi gửi cho client.
- **Kết quả:** Interceptor đã thành công tự động bọc mọi kết quả từ controller thành object có định dạng `{ data, status }`.
- **Minh chứng:**
  ![Interceptor](./assets/interceptor.png)
