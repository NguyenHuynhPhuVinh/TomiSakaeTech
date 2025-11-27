# Hướng dẫn cấu hình Redis

## Tổng quan

Ứng dụng sử dụng Redis để cache dữ liệu từ Google Drive API, giúp giảm số lượng API calls và tăng tốc độ load.

## Lựa chọn Redis

### 1. Redis Cloud (Khuyến nghị - Miễn phí)

Redis Cloud cung cấp 30MB storage miễn phí, đủ dùng cho ứng dụng cá nhân.

#### Bước 1: Đăng ký tài khoản

1. Truy cập [Redis Cloud](https://redis.com/try-free/)
2. Click **Get Started Free**
3. Đăng ký bằng email hoặc Google/GitHub

#### Bước 2: Tạo Database

1. Sau khi đăng nhập, click **New Database**
2. Chọn **Free** tier
3. Chọn Cloud Provider và Region:
   - **AWS** → `ap-southeast-1` (Singapore) - khuyến nghị cho Việt Nam
   - Hoặc region gần nhất với bạn
4. Đặt tên database (ví dụ: `tomisakaetech-cache`)
5. Click **Create Database**

#### Bước 3: Lấy Connection String

1. Đợi database được tạo (khoảng 1-2 phút)
2. Click vào database vừa tạo
3. Trong tab **Configuration**, tìm:
   - **Public endpoint**: `redis-12345.c123.ap-southeast-1-1.ec2.cloud.redislabs.com:12345`
   - **Default user password**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

4. Tạo connection string:
```
redis://default:[PASSWORD]@[ENDPOINT]
```

**Ví dụ:**
```env
REDIS_URL=redis://default:AbCdEfGhIjKlMnOpQrStUvWxYz123456@redis-12345.c123.ap-southeast-1-1.ec2.cloud.redislabs.com:12345
```

### 2. Upstash (Alternative - Miễn phí)

Upstash cũng cung cấp Redis miễn phí với 10,000 commands/ngày.

#### Bước 1: Đăng ký

1. Truy cập [Upstash](https://upstash.com/)
2. Đăng ký tài khoản

#### Bước 2: Tạo Database

1. Click **Create Database**
2. Đặt tên và chọn region
3. Click **Create**

#### Bước 3: Lấy Connection String

1. Vào database vừa tạo
2. Copy **UPSTASH_REDIS_REST_URL** hoặc **Redis URL**

### 3. Local Redis (Development)

#### Windows (WSL hoặc Docker)

**Cách 1: Docker**
```bash
docker run -d --name redis -p 6379:6379 redis
```

**Cách 2: WSL**
```bash
# Trong WSL
sudo apt update
sudo apt install redis-server
sudo service redis-server start
```

#### macOS

```bash
brew install redis
brew services start redis
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

#### Connection String cho Local

```env
REDIS_URL=redis://localhost:6379
```

## Cấu hình Environment Variable

Thêm vào file `.env`:

```env
REDIS_URL=redis://default:password@host:port
```

## Kiểm tra kết nối

### Cách 1: Qua ứng dụng

1. Chạy `npm run dev`
2. Truy cập trang `/files`
3. Nếu load được danh sách files, Redis đang hoạt động

### Cách 2: Qua redis-cli

```bash
# Local
redis-cli ping
# Output: PONG

# Remote (Redis Cloud)
redis-cli -u "redis://default:password@host:port" ping
# Output: PONG
```

### Cách 3: Qua Node.js

```javascript
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

redis.ping().then(result => {
  console.log(result); // PONG
  redis.disconnect();
});
```

## Cách ứng dụng sử dụng Redis

### Cache Strategy

Ứng dụng cache danh sách files từ Google Drive:

```typescript
// Kiểm tra cache
const cached = await redis.get(`drive:files:${folderId}`);
if (cached) {
  return JSON.parse(cached);
}

// Nếu không có cache, gọi API
const files = await drive.files.list({ ... });

// Lưu vào cache (TTL 5 phút)
await redis.setex(`drive:files:${folderId}`, 300, JSON.stringify(files));

return files;
```

### Cache Keys

| Key Pattern | Mô tả | TTL |
|-------------|-------|-----|
| `drive:files:{folderId}` | Danh sách files trong folder | 5 phút |
| `drive:info:{fileId}` | Thông tin chi tiết file | 10 phút |
| `drive:quota` | Thông tin dung lượng | 1 phút |

### Xóa Cache

Khi upload/delete file, cache sẽ tự động bị xóa để đảm bảo dữ liệu mới nhất.

## Troubleshooting

### Lỗi "ECONNREFUSED"

**Nguyên nhân:** Không kết nối được đến Redis server

**Giải pháp:**
1. Kiểm tra Redis server đang chạy
2. Kiểm tra URL đúng format
3. Kiểm tra firewall/network

### Lỗi "NOAUTH Authentication required"

**Nguyên nhân:** Thiếu password trong connection string

**Giải pháp:**
```env
# Sai
REDIS_URL=redis://host:port

# Đúng
REDIS_URL=redis://default:password@host:port
```

### Lỗi "WRONGPASS invalid username-password pair"

**Nguyên nhân:** Password sai

**Giải pháp:**
1. Kiểm tra lại password từ Redis Cloud dashboard
2. Đảm bảo không có ký tự đặc biệt bị encode sai

### Lỗi timeout

**Nguyên nhân:** Network latency cao hoặc Redis server quá tải

**Giải pháp:**
1. Chọn region gần hơn
2. Tăng timeout trong config:
```typescript
const redis = new Redis(process.env.REDIS_URL, {
  connectTimeout: 10000,
  commandTimeout: 5000,
});
```

## Giới hạn miễn phí

### Redis Cloud (Free Tier)

| Tài nguyên | Giới hạn |
|------------|----------|
| Storage | 30 MB |
| Connections | 30 |
| Bandwidth | Unlimited |

### Upstash (Free Tier)

| Tài nguyên | Giới hạn |
|------------|----------|
| Commands | 10,000/ngày |
| Storage | 256 MB |
| Bandwidth | 50 GB/tháng |

## Không dùng Redis?

Nếu không muốn setup Redis, ứng dụng vẫn chạy được nhưng:
- Mỗi lần load trang sẽ gọi Google Drive API
- Có thể bị rate limit nếu refresh nhiều
- Tốc độ load chậm hơn

Để disable Redis, có thể comment out các đoạn code liên quan đến cache hoặc để `REDIS_URL` trống (cần sửa code để handle trường hợp này).
