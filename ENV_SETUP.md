# 🔧 Cấu Hình Environment Variables cho Backend

## ✅ Backend CẦN file `.env`

Backend NestJS sử dụng `@nestjs/config` để đọc environment variables từ file `.env`.

## 📝 Các biến môi trường cần thiết

### 1. **Database Configuration** (Bắt buộc)
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=sms_demo
```

### 2. **Application Configuration**
```env
PORT=3000
APP_URL=http://localhost:3000
```

### 3. **JWT Configuration** (Bắt buộc cho authentication)
```env
JWT_SECRET=516b508ace08b91b46ed9b88b9ef0361
```
⚠️ **Lưu ý**: Thay đổi JWT_SECRET thành một giá trị ngẫu nhiên và bảo mật trong production!

### 4. **Gemini API** (Tùy chọn - chỉ cần nếu dùng chatbot)
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_EMBED_MODEL=gemini-embedding-001
```

## 🚀 Cách setup

### Local Development:
1. Copy file `env.example` thành `.env`:
   ```bash
   cp env.example .env
   ```

2. Chỉnh sửa file `.env` với thông tin của bạn:
   ```bash
   nano .env
   # hoặc
   code .env
   ```

3. Chạy ứng dụng:
   ```bash
   npm run start:dev
   ```

### Production (Docker):
Environment variables được set trong `docker-compose.yml` hoặc file `.env` ở thư mục gốc.

## 📍 Nơi sử dụng các biến

| Biến | Nơi sử dụng | Mặc định |
|------|-------------|----------|
| `DB_HOST` | `database.config.ts` | `127.0.0.1` |
| `DB_PORT` | `database.config.ts` | `3306` |
| `DB_USER` | `database.config.ts` | `root` |
| `DB_PASS` | `database.config.ts` | `undefined` |
| `DB_NAME` | `database.config.ts` | `sms_demo` |
| `PORT` | `main.ts` | `3000` |
| `APP_URL` | `upload.controller.ts` | `http://localhost:3000` |
| `JWT_SECRET` | `auth.module.ts`, `jwt.strategy.ts` | `516b508ace08b91b46ed9b88b9ef0361` |
| `GEMINI_API_KEY` | `chatbot.service.ts`, `rag.service.ts` | - |
| `GEMINI_EMBED_MODEL` | `search.service.ts`, `rag.service.ts` | `gemini-embedding-001` |

## ⚠️ Lưu ý quan trọng

1. **File `.env` đã được ignore trong `.gitignore`** - không commit file này lên Git
2. **JWT_SECRET**: Phải thay đổi trong production, không dùng giá trị mặc định
3. **DB_PASS**: Nếu database không có password, để trống hoặc không set
4. **APP_URL**: Cập nhật với URL thực tế khi deploy (ví dụ: `http://your-ec2-ip:3000`)

## 🔍 Kiểm tra

Sau khi setup, kiểm tra xem backend có đọc được env không:
```bash
# Xem logs khi start
npm run start:dev

# Hoặc test connection database
npm run typeorm -- migration:run
```

## 🐳 Docker

Khi dùng Docker, các biến được set trong `docker-compose.yml`:
```yaml
backend:
  environment:
    - DB_HOST=mysql
    - DB_PORT=3306
    - DB_USER=${DB_USER}
    - DB_PASS=${DB_PASS}
    - DB_NAME=${DB_NAME}
    - JWT_SECRET=${JWT_SECRET}
    - APP_URL=${APP_URL}
```
