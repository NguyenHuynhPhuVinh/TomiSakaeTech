# Hướng dẫn cấu hình Firebase

## Tổng quan

Ứng dụng sử dụng Firebase Realtime Database để lưu trữ ghi chú. Hướng dẫn này sẽ giúp bạn tạo project Firebase và lấy các credentials cần thiết.

## Bước 1: Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** (hoặc **Create a project**)
3. Nhập tên project (ví dụ: `my-notes-app`)
4. Có thể bật/tắt Google Analytics tùy ý
5. Click **Create project**
6. Đợi project được tạo xong, click **Continue**

## Bước 2: Thêm Web App

1. Trong Firebase Console, click biểu tượng **</>** (Web) để thêm web app
2. Nhập tên app (ví dụ: `my-notes-web`)
3. Không cần check "Firebase Hosting"
4. Click **Register app**
5. Copy đoạn config hiển thị:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebasedatabase.app",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

6. Click **Continue to console**

## Bước 3: Tạo Realtime Database

1. Trong menu bên trái, click **Build** → **Realtime Database**
2. Click **Create Database**
3. Chọn location gần nhất:
   - `asia-southeast1` (Singapore) - khuyến nghị cho Việt Nam
   - `us-central1` (Iowa)
   - Các region khác tùy vị trí của bạn
4. Chọn **Start in test mode** (cho phép đọc/ghi tự do trong 30 ngày)
5. Click **Enable**

## Bước 4: Cấu hình Security Rules

### Test Mode (Development)

Mặc định khi chọn test mode:

```json
{
  "rules": {
    ".read": "now < 1234567890000",
    ".write": "now < 1234567890000"
  }
}
```

### Production Mode (Khuyến nghị)

Để cho phép đọc/ghi không giới hạn thời gian:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**Cách cập nhật rules:**
1. Vào **Realtime Database** → tab **Rules**
2. Thay đổi rules
3. Click **Publish**

### Rules nâng cao (Bảo mật hơn)

Nếu muốn bảo mật hơn, có thể dùng rules sau:

```json
{
  "rules": {
    "notes": {
      ".read": true,
      ".write": true,
      "$noteId": {
        ".validate": "newData.hasChildren(['content', 'createdAt'])"
      }
    }
  }
}
```

## Bước 5: Cấu hình Environment Variables

Thêm vào file `.env`:

```env
FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app/
FIREBASE_PROJECT_ID=your-project
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abcdef123456
FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Mapping từ firebaseConfig:

| firebaseConfig | .env |
|----------------|------|
| `apiKey` | `FIREBASE_API_KEY` |
| `authDomain` | `FIREBASE_AUTH_DOMAIN` |
| `databaseURL` | `FIREBASE_DATABASE_URL` |
| `projectId` | `FIREBASE_PROJECT_ID` |
| `storageBucket` | `FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `FIREBASE_APP_ID` |
| `measurementId` | `FIREBASE_MEASUREMENT_ID` |

## Lưu ý quan trọng

### Database URL

- URL có dạng: `https://[PROJECT_ID]-default-rtdb.[REGION].firebasedatabase.app/`
- Nếu chọn region `asia-southeast1`: `https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app/`
- Nếu chọn region `us-central1`: `https://your-project-default-rtdb.firebaseio.com/`

### Kiểm tra kết nối

Sau khi cấu hình, bạn có thể test bằng cách:
1. Chạy ứng dụng: `npm run dev`
2. Truy cập trang `/txt`
3. Thử tạo một ghi chú mới
4. Kiểm tra trong Firebase Console → Realtime Database → Data

## Troubleshooting

### Lỗi "Permission denied"

**Nguyên nhân:** Security rules không cho phép đọc/ghi

**Giải pháp:**
1. Vào Firebase Console → Realtime Database → Rules
2. Đổi thành:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
3. Click Publish

### Lỗi "Firebase: Error (auth/invalid-api-key)"

**Nguyên nhân:** API key sai hoặc thiếu

**Giải pháp:**
1. Kiểm tra lại `FIREBASE_API_KEY` trong `.env`
2. Đảm bảo không có khoảng trắng thừa
3. Restart server sau khi sửa `.env`

### Lỗi "Database URL is not defined"

**Nguyên nhân:** Thiếu `FIREBASE_DATABASE_URL`

**Giải pháp:**
1. Vào Firebase Console → Realtime Database
2. Copy URL từ thanh địa chỉ phía trên data
3. Thêm vào `.env`

### Lỗi CORS

**Nguyên nhân:** Gọi trực tiếp từ browser đến Firebase

**Giải pháp:** Đảm bảo gọi qua API routes của Next.js, không gọi trực tiếp từ client

## Cấu trúc dữ liệu

Ứng dụng lưu ghi chú với cấu trúc:

```json
{
  "notes": {
    "note_id_1": {
      "content": "Nội dung ghi chú",
      "createdAt": 1699999999999
    },
    "note_id_2": {
      "content": "Ghi chú khác",
      "createdAt": 1699999999998
    }
  }
}
```

## Giới hạn miễn phí (Spark Plan)

| Tài nguyên | Giới hạn |
|------------|----------|
| Dung lượng | 1 GB |
| Download | 10 GB/tháng |
| Connections đồng thời | 100 |

Đủ dùng cho ứng dụng cá nhân. Nếu cần nhiều hơn, upgrade lên Blaze Plan (pay-as-you-go).
