# Frontend - AI Repurchase Prediction App

Giao diện người dùng cho ứng dụng dự đoán khả năng mua lại của khách hàng. Xây dựng bằng **Next.js 14+**, **React**, **TypeScript** và **Tailwind CSS**. Triển khai trên **Vercel**.

## Tổng quan

Frontend cung cấp:
- Trang chủ giới thiệu ứng dụng
- Form nhập liệu giao dịch dạng bảng động
- Hiển thị kết quả dự đoán với biểu đồ Gauge
- Trang lịch sử dự đoán
- Responsive design cho mobile và desktop

## Tech Stack

| Công nghệ | Mục đích |
|-----------|----------|
| **Next.js 14+** | React framework với App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first CSS framework |
| **Recharts** | Biểu đồ và visualization |
| **Axios** | HTTP client gọi API |
| **Lucide React** | Icon library |

## Cấu trúc thư mục

```
frontend/
├── src/
│   ├── app/                    # App Router (Next.js 14+)
│   │   ├── page.tsx            # Trang chủ (Landing page)
│   │   ├── layout.tsx          # Root layout (Navbar, Footer)
│   │   ├── apply/
│   │   │   └── page.tsx        # Trang nhập liệu dự đoán
│   │   └── history/
│   │       └── page.tsx        # Trang lịch sử dự đoán
│   ├── components/
│   │   ├── layout/             # Navbar, Footer
│   │   ├── predict/            # Components cho tính năng dự đoán
│   │   │   ├── TransactionTable.tsx    # Bảng nhập liệu động
│   │   │   ├── PredictResult.tsx       # Hiển thị kết quả + Gauge
│   │   │   └── QuickFillButton.tsx     # Nút lấy data từ DB
│   │   └── ui/                 # UI components (Button, Input, Card...)
│   ├── services/               # API calls
│   │   ├── api.ts              # Gọi POST /predict, GET /applications
│   │   └── customer.ts         # Gọi GET /customers/{id}/history
│   ├── types/                  # TypeScript definitions
│   │   └── index.ts            # Interfaces cho Transaction, PredictResponse
│   └── lib/                    # Utilities
│       └── utils.ts            # Helper functions (cn, formatters)
├── .env.local                  # Environment variables
├── tailwind.config.ts          # Tailwind configuration
├── next.config.js              # Next.js configuration
└── package.json                # Dependencies
```

## Cài đặt Local

### 1. Clone repository

```bash
git clone <repo-url>
cd frontend
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình environment variables

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Với production, sử dụng URL backend trên Render:

```env
NEXT_PUBLIC_API_URL=https://your-api.onrender.com
```

### 4. Chạy development server

```bash
npm run dev
```

Server chạy tại: `http://localhost:3000`

### 5. Build production

```bash
npm run build
npm start
```

## Scripts

| Script | Mô tả |
|--------|-------|
| `npm run dev` | Chạy development server với hot reload |
| `npm run build` | Build cho production |
| `npm run start` | Chạy production server |
| `npm run lint` | Kiểm tra code với ESLint |

## Các trang chính

### 1. Trang chủ (`/`)

- Giới thiệu ứng dụng
- Mô tả cách hoạt động
- Call-to-action đến trang dự đoán

### 2. Trang dự đoán (`/apply`)

**Tính năng:**
- Bảng nhập liệu động (thêm/xóa dòng giao dịch)
- Input Customer ID và Snapshot Date
- Nút "Lấy lịch sử" - tự động điền dữ liệu từ database
- Hiển thị kết quả với:
  - Xác suất mua lại (%)
  - Badge trạng thái (High/Medium/Low)
  - Gauge chart trực quan
  - Top 3 lý do ảnh hưởng

**Validation:**
- Không cho submit nếu thiếu thông tin
- Order_date phải <= snapshot_date

### 3. Trang lịch sử (`/history`)

**Tính năng:**
- Bảng hiển thị các lần dự đoán
- Phân trang (pagination)
- Thống kê tổng hợp (tổng lượt test, % mua lại)
- Chi tiết từng bản ghi

## Components chính

### TransactionTable

Bảng nhập liệu động cho phép:
- Thêm dòng giao dịch mới
- Xóa dòng giao dịch
- Nhập thông tin: Order_id, Total_items, Order_date, Order_value, etc.

### PredictResult

Hiển thị kết quả dự đoán:
- Gauge chart hiển thị xác suất
- Badge màu theo potential level
- Danh sách top reasons

### QuickFillButton

- Input Customer ID
- Fetch lịch sử giao dịch từ database
- Tự động điền vào bảng

## API Integration

Các API calls được định nghĩa trong `src/services/api.ts`:

```typescript
// Dự đoán
POST /predict

// Lấy lịch sử
GET /applications?page=1&limit=10

// Health check
GET /health
```

## Responsive Design

Breakpoints:
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl, 2xl)

## Triển khai lên Vercel

### 1. Push code lên GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Import project trên Vercel

1. Đăng nhập [vercel.com](https://vercel.com)
2. Click **Add New...** → **Project**
3. Chọn repository GitHub
4. Cấu hình:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend` (nếu dùng monorepo)
   - **Build Command**: `next build` (mặc định)
   - **Output Directory**: `.next` (mặc định)
5. Thêm Environment Variables:
   - `NEXT_PUBLIC_API_URL`: URL backend trên Render
6. Click **Deploy**

### 3. Cấu hình Auto-deploy

Vercel tự động deploy khi push code lên `main` branch.

## Environment Variables

| Variable | Mô tả | Required |
|----------|-------|----------|
| `NEXT_PUBLIC_API_URL` | URL của backend API | Yes |

**Lưu ý:** Biến bắt đầu với `NEXT_PUBLIC_` mới có thể truy cập từ browser.

## Tài liệu tham khảo

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org/en-US/)
- [Lucide Icons](https://lucide.dev/)

## License

MIT License - VTI Academy Mini Project
