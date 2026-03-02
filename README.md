# FruitHub

## Giới thiệu

Fruithub là web bán thực phẩm trái cây, rau củ tươi sống, được xây dựng với công nghệ hiện đại. Dự án bao gồm Frontend (React) và Backend (Node.js/Express).

---

## Tính năng nổi bật

### Dành cho Khách hàng

- Tìm kiếm, lọc và xem chi tiết sản phẩm
- Quản lý giỏ hàng thông minh
- Đặt hàng và theo dõi trạng thái đơn hàng
- Quản lý tài khoản và địa chỉ giao hàng
- Đánh giá sản phẩm
- Giao diện responsive trên desktop, mobile

### Dành cho Người bán (Admin)

- Dashboard quản lý tổng quan
- Quản lý sản phẩm (CRUD, upload hình ảnh)
- Quản lý đơn hàng và cập nhật trạng thái
- Quản lý người dùng
- Thống kê sản phẩm bán chạy
- Rất tiếc hiện tại chương trình chưa hỗ trợ tạo tài khoản user cho người dùng phía client
- Để được cáp quyền đăng nhập với role admin, bạn có thể liên hệ mình theo thông tin bên dưới.

---

## Techstack

### Frontend

- **React 19** - Thư viện UI hiện đại
- **Vite** - Build tool cực nhanh
- **Tailwind CSS** - CSS framework
- **React Router** - Routing
- **Axios** - HTTP client
- **Context API** - State management

### Backend

- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - NoSQL database
- **JWT** - Authentication & authorization
- **Bcrypt** - Mã hóa mật khẩu
- **Cloudinary** - Lưu trữ hình ảnh
- **Multer** - File upload

---

## Cấu trúc dự án

```
FFW-server/
├── client/              # Frontend React Application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Context API
│   │   └── utils/       # Utilities
│   ├── package.json
│   └── README.md        # Client documentation
│
├── server/              # Backend API
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── models/      # Database schemas
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   ├── middlewares/ # Authentication & validation
│   │   └── utils/       # Helpers
│   ├── package.json
│   └── README.md        # Server documentation
│
└── README.md            # File này
```

---

## Hướng dẫn cài đặt

### Yêu cầu hệ thống

- **Node.js** 18.x trở lên
- **npm** 9.x trở lên
- **MongoDB** (local hoặc MongoDB Atlas)

### Cài đặt nhanh

#### 1. Clone repository

```powershell
git clone https://github.com/vanhuy2005/fresh-fruit-web.git
cd fresh-frui-web
```

#### 2. Cài đặt Backend

```powershell
cd server
npm install
```

Tạo file `.env` từ `.env.sample` và cấu hình:

```powershell
Copy-Item .env.sample .env
```

Chạy server:

```powershell
npm run dev
# Server chạy tại http://localhost:3000
```

#### 3. Cài đặt Frontend

Mở terminal mới:

```powershell
cd client
npm install
```

Chạy client:

```powershell
npm run dev
# Client chạy tại http://localhost:5173
```

---

## Documentation

Để biết thêm chi tiết về cài đặt và sử dụng:

- **[Client Documentation](./client/README.md)** - Hướng dẫn chi tiết Frontend
- **[Server Documentation](./server/README.md)** - Hướng dẫn chi tiết Backend API

---

## Các kỹ thuật đã được áp dụng

### Authentication & Security

- JWT-based authentication
- Role-based access control (User/Admin)
- Bcrypt password hashing

### API Features

- RESTful API design
- CORS configuration
- File upload với Multer
- Image hosting với Cloudinary
- MongoDB aggregation pipelines

### Frontend Features

- React Context for state management
- Protected routes
- Hot reload với Vite
- Tailwind CSS utilities
- Toast notifications

---

## Tổng quan API endpoint 

### Public

- `POST /api/v1/register` - Đăng ký
- `POST /api/v1/login` - Đăng nhập
- `GET /api/v1/products` - Danh sách sản phẩm

### User (Authentication required)

- `GET /api/v1/user/:id` - Thông tin user
- `POST /api/v1/cart/product` - Thêm vào giỏ
- `POST /api/v1/order` - Tạo đơn hàng

### Admin (Admin role required)

- `POST /api/v1/admin/product` - Tạo sản phẩm
- `GET /api/v1/admin/orders` - Quản lý đơn hàng
- `GET /api/v1/admin/users` - Quản lý người dùng

Xem chi tiết tại [Server Documentation](./server/README.md#-api-endpoints)

---

## Database Models

Hệ thống sử dụng 5 models chính:

- **User** - Quản lý người dùng (khách hàng & admin)
- **Product** - Sản phẩm thực phẩm tươi sống
- **Cart** - Giỏ hàng của người dùng
- **Order** - Đơn hàng và chi tiết
- **Review** - Đánh giá sản phẩm

Xem chi tiết schema tại [Server Documentation](./server/README.md#-database-models)

---

## Configuration

### Backend (.env)

```env
MONGODB_URI=your_mongodb_connection_string
PORT_BE=3000
USER_ACCESS_TOKEN_SECRET=your_secret
ADMIN_ACCESS_TOKEN_SECRET=your_admin_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend

Frontend mặc định kết nối tới backend tại `http://localhost:3000` (hoặc production URL đã config).

---

## Đóng góp

### Contributors

Cảm ơn tất cả những người đã đóng góp vào dự án này! 💚

Nếu bạn muốn đóng góp:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add some amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

---

## License

Dự án được phát hành dưới giấy phép **ISC**.

---

## Lời cảm ơn

Xin chân thành cảm ơn:

- **React Team** - Thư viện UI tuyệt vời
- **Vite Team** - Build tool cực nhanh
- **MongoDB Team** - Database linh hoạt
- **Cloudinary** - Image hosting service
- **Tailwind CSS** - CSS framework hiệu quả
- **Tất cả contributors** - Những người đã đóng góp code, báo lỗi, đề xuất tính năng

Cảm ơn cộng đồng open-source đã tạo ra những công cụ tuyệt vời này! 🎉

---

## Liên hệ & Hỗ trợ

- **GitHub Issues**: [Report bugs hoặc request features](url-github/issues)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ by FFW Team**

**Happy Shopping!**
