# FFW Server - Backend API

## 📋 Giới thiệu

Backend RESTful API cho hệ thống thương mại điện tử FFW, được xây dựng với **Node.js**, **Express** và **MongoDB**. API cung cấp các chức năng quản lý người dùng, sản phẩm, giỏ hàng, đơn hàng và đánh giá.

### ✨ Tính năng chính

- 🔐 **Xác thực & Phân quyền**: JWT-based authentication với role-based access control (User/Admin)
- 👥 **Quản lý người dùng**: Đăng ký, đăng nhập, cập nhật thông tin, đổi mật khẩu
- 📦 **Quản lý sản phẩm**: CRUD sản phẩm, tìm kiếm, lọc theo danh mục
- 🛒 **Giỏ hàng**: Thêm/xóa/cập nhật sản phẩm trong giỏ
- 📋 **Đơn hàng**: Tạo đơn, theo dõi trạng thái, hủy đơn, quản lý đơn hàng (Admin)
- ⭐ **Đánh giá sản phẩm**: Khách hàng đánh giá sau khi mua
- 📸 **Upload ảnh**: Tích hợp Cloudinary cho quản lý hình ảnh

---

## 🛠️ Công nghệ sử dụng

- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Database & ODM
- **JWT** - Authentication
- **Bcrypt** - Mã hóa mật khẩu
- **Cloudinary** - Lưu trữ hình ảnh
- **Multer** - Upload file

---

## 📋 Yêu cầu hệ thống

- **Node.js** phiên bản `18.x` trở lên
- **npm** phiên bản `9.x` trở lên
- **MongoDB** (local hoặc MongoDB Atlas)

---

## 🚀 Hướng dẫn cài đặt

### Bước 1: Clone repository

```powershell
git clone https://github.com/vanhuy2005/fresh-fruit-web.git
cd fresh-fruit-web
```

### Bước 2: Cài đặt dependencies

```powershell
cd server
npm install
```

### Bước 3: Cấu hình biến môi trường

Tạo file `.env` từ `.env.sample`:

```powershell
Copy-Item .env.sample .env
```

Mở file `.env` và cấu hình các biến:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ffw-ecommerce
# hoặc MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT Secrets
ACCESS_TOKEN_SECRET=your_secret_key_here
USER_ACCESS_TOKEN_SECRET=your_user_secret_here
ADMIN_ACCESS_TOKEN_SECRET=your_admin_secret_here
ACCESS_TOKEN_EXPIRES=1h

# Admin Creation Secret
ADMIN_CREATION_SECRET=your_admin_creation_secret

# Server & Client Ports
PORT_BE=3000
PORT_FE=5173

# Cloudinary (đăng ký tại https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Bước 4: Chạy server

**Development mode** (auto-reload):

```powershell
npm run dev
```

**Production mode**:

```powershell
npm start
```

Server sẽ chạy tại: **http://localhost:3000**

---

## 🔑 API Endpoints

### Public Routes (`/api/v1`)

| Method | Endpoint          | Mô tả                  |
| ------ | ----------------- | ---------------------- |
| POST   | `/register`       | Đăng ký tài khoản      |
| POST   | `/login`          | Đăng nhập              |
| GET    | `/products`       | Lấy danh sách sản phẩm |
| GET    | `/product/:id`    | Chi tiết sản phẩm      |
| GET    | `/product/search` | Tìm kiếm sản phẩm      |

### User Routes (`/api/v1`) - Yêu cầu JWT

| Method | Endpoint               | Mô tả                |
| ------ | ---------------------- | -------------------- |
| POST   | `/logout`              | Đăng xuất            |
| GET    | `/user/:id`            | Thông tin người dùng |
| PATCH  | `/user/:id`            | Cập nhật thông tin   |
| PATCH  | `/user/changePassword` | Đổi mật khẩu         |
| POST   | `/product/:id/review`  | Đánh giá sản phẩm    |

### Cart Routes (`/api/v1/cart`) - Yêu cầu JWT

| Method | Endpoint              | Mô tả             |
| ------ | --------------------- | ----------------- |
| POST   | `/`                   | Tạo giỏ hàng      |
| GET    | `/:userId`            | Lấy giỏ hàng      |
| POST   | `/product`            | Thêm sản phẩm     |
| PATCH  | `/product/:productId` | Cập nhật số lượng |
| DELETE | `/product/:productId` | Xóa sản phẩm      |
| DELETE | `/:cartId`            | Xóa giỏ hàng      |

### Order Routes (`/api/v1/order`) - Yêu cầu JWT

| Method | Endpoint           | Mô tả             |
| ------ | ------------------ | ----------------- |
| POST   | `/`                | Tạo đơn hàng      |
| GET    | `/user/:userId`    | Đơn hàng của user |
| GET    | `/:orderId`        | Chi tiết đơn hàng |
| PATCH  | `/:orderId/cancel` | Hủy đơn hàng      |

### Admin Routes (`/api/v1/admin`) - Yêu cầu JWT + Admin Role

| Method | Endpoint            | Mô tả                   |
| ------ | ------------------- | ----------------------- |
| GET    | `/users`            | Danh sách người dùng    |
| GET    | `/stats`            | Thống kê người dùng     |
| DELETE | `/user/:id`         | Xóa người dùng          |
| GET    | `/products`         | Danh sách sản phẩm      |
| POST   | `/product`          | Tạo sản phẩm mới        |
| PATCH  | `/product/:id`      | Cập nhật sản phẩm       |
| DELETE | `/product/:id`      | Xóa sản phẩm            |
| GET    | `/orders`           | Danh sách đơn hàng      |
| PATCH  | `/order/:id/status` | Cập nhật trạng thái đơn |

---

## 📁 Cấu trúc thư mục

```
server/
├── src/
│   ├── controllers/       # Xử lý logic API
│   │   ├── adminControllers/
│   │   ├── cartControllers/
│   │   ├── orderControllers/
│   │   ├── reviewControllers/
│   │   ├── sharedControllers/
│   │   └── userControllers/
│   ├── models/           # Database schemas
│   │   ├── cart.model.js
│   │   ├── order.model.js
│   │   ├── product.model.js
│   │   ├── review.model.js
│   │   └── user.model.js
│   ├── routes/           # API routes
│   │   ├── admin.route.js
│   │   ├── cart.route.js
│   │   ├── order.route.js
│   │   └── user.route.js
│   ├── services/         # Business logic
│   ├── middlewares/      # Authentication & validation
│   │   ├── verifyToken.middleware.js
│   │   └── verifyRole.middleware.js
│   └── utils/            # Helpers & config
│       ├── cloudinary.js
│       ├── db.js
│       ├── multer.js
│       └── constants.js
├── uploads/              # Thư mục tạm cho file upload
├── .env                  # Biến môi trường (không commit)
├── .env.sample           # Template biến môi trường
├── package.json
└── server.js             # Entry point
```

---

## 🔒 Authentication & Authorization

### JWT Token Structure

Server sử dụng 3 loại secret keys:

- `USER_ACCESS_TOKEN_SECRET` - Token cho user thường
- `ADMIN_ACCESS_TOKEN_SECRET` - Token cho admin
- `ACCESS_TOKEN_SECRET` - Legacy token (backward compatibility)

### Headers

Gửi JWT token trong header:

```
Authorization: Bearer <your_jwt_token>
```

### Roles

- `user` - Người dùng thông thường
- `admin` - Quản trị viên

---

## 📝 Database Models

### 👤 User Model

| Field       | Type   | Required | Mô tả                |
| ----------- | ------ | -------- | -------------------- |
| firstName   | String | No       | Tên                  |
| lastName    | String | No       | Họ                   |
| email       | String | Yes      | Email (unique)       |
| password    | String | Yes      | Mật khẩu (đã mã hóa) |
| role        | String | Yes      | `user` hoặc `admin`  |
| age         | Number | No       | Tuổi                 |
| address     | String | No       | Địa chỉ              |
| phoneNumber | String | No       | Số điện thoại        |
| avatar      | String | No       | URL ảnh đại diện     |
| createdAt   | Date   | Auto     | Ngày tạo             |
| updatedAt   | Date   | Auto     | Ngày cập nhật        |

### 📦 Product Model

| Field         | Type          | Required | Mô tả                              |
| ------------- | ------------- | -------- | ---------------------------------- |
| name          | String        | Yes      | Tên sản phẩm (unique)              |
| description   | String        | No       | Mô tả chi tiết                     |
| price         | Number        | Yes      | Giá gốc                            |
| offerPrice    | Number        | No       | Giá khuyến mãi                     |
| category      | String        | Yes      | Danh mục chính                     |
| subCategory   | String        | No       | Danh mục phụ                       |
| image         | Array[String] | Yes      | Mảng URL hình ảnh                  |
| bestseller    | Boolean       | No       | Sản phẩm bán chạy (default: false) |
| stock         | Number        | No       | Số lượng tồn kho (default: 0)      |
| unit          | String        | No       | Đơn vị tính (default: 'kg')        |
| origin        | String        | No       | Xuất xứ                            |
| rating        | Number        | No       | Điểm đánh giá (default: 0)         |
| reviewCount   | Number        | No       | Số lượt đánh giá (default: 0)      |
| averageRating | Number        | No       | Điểm trung bình (default: 0)       |
| sold          | Number        | No       | Đã bán (default: 0)                |
| isActive      | Boolean       | No       | Trạng thái (default: true)         |
| createdAt     | Date          | Auto     | Ngày tạo                           |
| updatedAt     | Date          | Auto     | Ngày cập nhật                      |

### 📋 Order Model

| Field           | Type     | Required | Mô tả                                                                     |
| --------------- | -------- | -------- | ------------------------------------------------------------------------- |
| userId          | ObjectId | Yes      | ID người đặt (ref: User)                                                  |
| orderNumber     | String   | No       | Mã đơn hàng (unique)                                                      |
| cartId          | ObjectId | Yes      | ID giỏ hàng (ref: Cart)                                                   |
| products        | Array    | Yes      | Danh sách sản phẩm đã đặt                                                 |
| ├─ productId    | ObjectId | Yes      | ID sản phẩm (ref: Product)                                                |
| ├─ name         | String   | Yes      | Tên sản phẩm                                                              |
| ├─ image        | String   | No       | Hình ảnh                                                                  |
| ├─ quantity     | Number   | Yes      | Số lượng (min: 1)                                                         |
| ├─ price        | Number   | Yes      | Đơn giá                                                                   |
| └─ total        | Number   | Yes      | Thành tiền                                                                |
| shippingAddress | String   | Yes      | Địa chỉ giao hàng                                                         |
| paymentMethod   | String   | Yes      | `cod` hoặc `online`                                                       |
| paymentStatus   | String   | No       | `pending`, `paid`, `failed`, `refunded`                                   |
| orderStatus     | String   | No       | `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled` |
| subtotal        | Number   | No       | Tổng tiền hàng                                                            |
| discount        | Number   | No       | Giảm giá (default: 0)                                                     |
| totalAmount     | Number   | No       | Tổng thanh toán                                                           |
| notes           | String   | No       | Ghi chú                                                                   |
| cancelAt        | Date     | No       | Thời gian hủy đơn                                                         |
| createdAt       | Date     | Auto     | Ngày tạo                                                                  |
| updatedAt       | Date     | Auto     | Ngày cập nhật                                                             |

### 🛒 Cart Model

| Field        | Type     | Required | Mô tả                        |
| ------------ | -------- | -------- | ---------------------------- |
| userId       | ObjectId | Yes      | ID người dùng (ref: User)    |
| products     | Array    | Yes      | Danh sách sản phẩm trong giỏ |
| ├─ productId | ObjectId | Yes      | ID sản phẩm (ref: Product)   |
| ├─ quantity  | Number   | Yes      | Số lượng (min: 1)            |
| └─ price     | Number   | Yes      | Đơn giá                      |
| totalAmount  | Number   | No       | Tổng tiền giỏ hàng           |
| createdAt    | Date     | Auto     | Ngày tạo                     |
| updatedAt    | Date     | Auto     | Ngày cập nhật                |

### ⭐ Review Model

| Field     | Type     | Required | Mô tả                         |
| --------- | -------- | -------- | ----------------------------- |
| userId    | ObjectId | Yes      | ID người đánh giá (ref: User) |
| productId | ObjectId | Yes      | ID sản phẩm (ref: Product)    |
| orderId   | ObjectId | No       | ID đơn hàng (ref: Order)      |
| rating    | Number   | Yes      | Điểm đánh giá (1-5)           |
| comment   | String   | No       | Nhận xét                      |
| createdAt | Date     | Auto     | Ngày tạo                      |
| updatedAt | Date     | Auto     | Ngày cập nhật                 |

---

## 📝 Scripts có sẵn

| Script    | Lệnh          | Mô tả                   |
| --------- | ------------- | ----------------------- |
| **dev**   | `npm run dev` | Chạy server với nodemon |
| **start** | `npm start`   | Chạy production server  |

---

## 🔧 Lưu ý quan trọng

### Cloudinary Setup

1. Đăng ký tài khoản tại [cloudinary.com](https://cloudinary.com)
2. Lấy credentials từ Dashboard
3. Cấu hình trong file `.env`

### MongoDB Setup

- **Local**: Cài MongoDB và chạy `mongod`
- **Cloud**: Sử dụng MongoDB Atlas (khuyến nghị)

### CORS Configuration

Mặc định cho phép:

- `https://ffw-deploy-nu.vercel.app` (production frontend)
- `http://localhost:5173` (local frontend)
- `https://ffw-deploy.onrender.com`

Chỉnh sửa trong `server.js` nếu cần thay đổi.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

**Happy coding! 🚀**
