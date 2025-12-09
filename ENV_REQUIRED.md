# 📋 Danh Sách Environment Variables Cần Thiết

## ⚠️ File .env hiện tại của bạn THIẾU các biến sau:

### 🔴 BẮT BUỘC (Thiếu trong .env của bạn):

1. **JWT_SECRET** - Bắt buộc cho authentication
   ```env
   JWT_SECRET=516b508ace08b91b46ed9b88b9ef0361
   ```
   ⚠️ **Quan trọng**: Thay đổi giá trị này trong production!

### 🟡 TÙY CHỌN (Nhưng nên có nếu dùng chatbot):

2. **GEMINI_API_KEY** - Chỉ cần nếu dùng tính năng chatbot
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **GEMINI_EMBED_MODEL** - Model cho embedding (có default)
   ```env
   GEMINI_EMBED_MODEL=gemini-embedding-001
   ```

## ✅ File .env ĐẦY ĐỦ nên có:

```env
# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=sms_demo

# Application Configuration
PORT=3000
APP_URL=http://localhost:3000

# JWT Configuration (BẮT BUỘC)
JWT_SECRET=516b508ace08b91b46ed9b88b9ef0361

# Gemini API Configuration (Tùy chọn - chỉ cần nếu dùng chatbot)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_EMBED_MODEL=gemini-embedding-001
```

## 🔧 Cách thêm vào file .env:

1. Mở file `.env` trong thư mục `bicycle-web`
2. Thêm các dòng sau vào cuối file:

```env
# JWT Configuration
JWT_SECRET=516b508ace08b91b46ed9b88b9ef0361

# Gemini API Configuration (Optional)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_EMBED_MODEL=gemini-embedding-001
```

## 📝 Lưu ý:

- **JWT_SECRET**: Nếu không có, authentication sẽ không hoạt động đúng
- **GEMINI_API_KEY**: Có thể để trống nếu không dùng chatbot
- **GEMINI_EMBED_MODEL**: Có giá trị mặc định nên có thể bỏ qua

