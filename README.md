# TomiSakaeTech 🚀

Ứng dụng web cá nhân được xây dựng bằng Next.js 16, tích hợp Google Drive làm storage và Firebase Realtime Database cho ghi chú.

## 📋 Mục lục

- [Tính năng](#-tính-năng)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt nhanh](#-cài-đặt-nhanh)
- [Cấu hình Environment Variables](#-cấu-hình-environment-variables)
- [Chạy ứng dụng](#-chạy-ứng-dụng)
- [Cấu trúc Project](#-cấu-trúc-project)
- [Tài liệu chi tiết](#-tài-liệu-chi-tiết)

## ✨ Tính năng

### 📁 Storage (Google Drive)
- Upload/Download files và folders
- Tạo thư mục mới
- Xem trước file (ảnh, video, PDF, code...)
- Tìm kiếm file bằng AI (Gemini)
- Upload từ mobile qua QR code
- Cache với Redis để tăng tốc

### 📝 Txt (Ghi chú)
- Tạo, sửa, xóa ghi chú
- Lưu trữ trên Firebase Realtime Database
- Sao chép nhanh nội dung

### 🔐 Admin
- Bảo vệ bằng mật khẩu
- Quản lý cấu hình

## 💻 Yêu cầu hệ thống

- Node.js 18.17 trở lên
- npm hoặc yarn
- Tài khoản Google Cloud (cho Google Drive API)
- Tài khoản Firebase (cho Realtime Database)
- Redis instance (khuyến nghị dùng Redis Cloud miễn phí)

## 🚀 Cài đặt nhanh

```bash
# Clone repository
git clone https://github.com/TomiSakae/TomiSakaeTech.git
cd TomiSakaeTech

# Cài đặt dependencies
npm install

# Copy file env mẫu
cp .env.example .env

# Cấu hình các biến môi trường (xem hướng dẫn bên dưới)
# Sau đó chạy ứng dụng
npm run dev
```

## 🔧 Cấu hình Environment Variables

Tạo file `.env` ở thư mục gốc với nội dung sau:

```env
# ============================================
# SHARED - Cấu hình chung
# ============================================
REDIS_URL=your_redis_url
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_PASSWORD=your_admin_password

# ============================================
# STORAGE WORLD - Google Drive
# ============================================
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
GOOGLE_DRIVE_ROOT_FOLDER_ID=your_root_folder_id
GEMINI_API_KEY=your_gemini_api_key

# ============================================
# TXT WORLD - Firebase
# ============================================
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your_project.firebasedatabase.app/
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Chi tiết từng biến:

| Biến | Mô tả | Bắt buộc |
|------|-------|----------|
| `REDIS_URL` | URL kết nối Redis (dùng cho cache) | ✅ |
| `NEXT_PUBLIC_APP_URL` | URL của ứng dụng | ✅ |
| `ADMIN_PASSWORD` | Mật khẩu admin | ✅ |
| `GOOGLE_CLIENT_ID` | OAuth2 Client ID từ Google Cloud | ✅ |
| `GOOGLE_CLIENT_SECRET` | OAuth2 Client Secret | ✅ |
| `GOOGLE_REFRESH_TOKEN` | Refresh token để truy cập Drive | ✅ |
| `GOOGLE_DRIVE_ROOT_FOLDER_ID` | ID folder gốc trên Drive | ✅ |
| `GEMINI_API_KEY` | API key cho AI search | ❌ |
| `FIREBASE_*` | Các config từ Firebase Console | ✅ |

## 📖 Hướng dẫn lấy credentials

### 1. Redis URL

**Cách 1: Redis Cloud (miễn phí)**
1. Đăng ký tại [Redis Cloud](https://redis.com/try-free/)
2. Tạo database miễn phí (30MB)
3. Copy connection string từ dashboard

**Cách 2: Local Redis**
```bash
# Cài đặt Redis
# Windows: dùng WSL hoặc Docker
# Mac: brew install redis
# Linux: sudo apt install redis-server

# URL local
REDIS_URL=redis://localhost:6379
```

### 2. Google Drive API

👉 Xem hướng dẫn chi tiết: [docs/GOOGLE_DRIVE_SETUP.md](docs/GOOGLE_DRIVE_SETUP.md)

**Tóm tắt:**
1. Tạo project trên [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google Drive API
3. Tạo OAuth2 credentials (Web application)
4. Publish app để refresh token không hết hạn
5. Lấy refresh token từ [OAuth Playground](https://developers.google.com/oauthplayground)
6. Tạo folder trên Drive và copy ID từ URL

### 3. Firebase

1. Tạo project tại [Firebase Console](https://console.firebase.google.com/)
2. Vào Project Settings → General
3. Scroll xuống "Your apps" → Add web app
4. Copy config object
5. Vào Realtime Database → Create Database
6. Chọn region gần nhất (asia-southeast1)
7. Chọn "Start in test mode" (hoặc cấu hình rules sau)

**Firebase Rules (khuyến nghị):**
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### 4. Gemini API (tùy chọn)

1. Truy cập [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API key"
3. Tạo key mới hoặc dùng key có sẵn

## 🏃 Chạy ứng dụng

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Lint
npm run lint
```

Truy cập: http://localhost:3000

## 📁 Cấu trúc Project

```
TomiSakaeTech/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── shared/        # Shared APIs (admin)
│   │   │   └── worlds/        # Feature APIs
│   │   │       ├── storage/   # Google Drive APIs
│   │   │       └── txt/       # Firebase APIs
│   │   ├── files/             # Storage page
│   │   └── txt/               # Notes page
│   ├── shared/                # Shared components & utils
│   │   ├── components/        # UI components
│   │   ├── lib/              # Utilities
│   │   └── types/            # TypeScript types
│   └── worlds/                # Feature modules
│       ├── home/             # Homepage
│       ├── storage/          # File management
│       └── txt/              # Notes management
├── docs/                      # Documentation
├── .env.example              # Environment template
└── package.json
```

## 📚 Tài liệu chi tiết

- [Cấu hình Google Drive API](docs/GOOGLE_DRIVE_SETUP.md)
- [Cấu hình Firebase](docs/FIREBASE_SETUP.md)
- [Cấu hình Redis](docs/REDIS_SETUP.md)

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI, Headless UI
- **State Management:** TanStack Query
- **Storage:** Google Drive API
- **Database:** Firebase Realtime Database
- **Cache:** Redis (ioredis)
- **AI:** Google Gemini

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request.

## 📄 License

MIT License
