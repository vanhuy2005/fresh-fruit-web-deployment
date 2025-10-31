# FFW Client - Ứng dụng E-commerce Frontend

## 📋 Giới thiệu

Phần giao diện người dùng (Frontend) của hệ thống thương mại điện tử FFW, được xây dựng bằng **React 19** và **Vite**

### ✨ Tính năng chính

#### Dành cho Khách hàng

- 🔍 Tìm kiếm, lọc và xem chi tiết sản phẩm
- 🛒 Quản lý giỏ hàng và đặt hàng
- 📦 Theo dõi đơn hàng, hủy đơn
- 👤 Quản lý thông tin cá nhân, địa chỉ giao hàng
- ⭐ Đánh giá sản phẩm

#### Dành cho Người bán

- Quản lý sản phẩm (thêm/sửa/xóa)
- 📋 Quản lý đơn hàng và cập nhật trạng thái
- 📊 Dashboard theo dõi cửa hàng

---

## 🛠️ Công nghệ sử dụng

- **React 19** - Thư viện UI
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS

---

## 📋 Yêu cầu hệ thống

- **Node.js** phiên bản `18.x` trở lên
- **npm** phiên bản `9.x` trở lên

Kiểm tra phiên bản:

```powershell
node -v
npm -v
```

---

## 🚀 Hướng dẫn cài đặt

### Bước 1: Clone repository

```powershell
git clone https://github.com/vanhuy2005/fresh-fruit-web.git
cd fresh-fruit-web
```

### Bước 2: Cài đặt dependencies

```powershell
cd client
npm install
```

### Bước 3: Chạy ứng dụng

```powershell
npm run dev
```

Ứng dụng sẽ chạy tại: **http://localhost:5173**

---

## 📁 Cấu trúc thư mục

```
client/
├── src/
│   ├── components/        # Component tái sử dụng
│   ├── context/          # Quản lý state (AppContext)
│   ├── pages/            # Các trang chính
│   ├── utils/            # Utilities, constants
│   ├── App.jsx           # Component gốc
│   └── main.jsx          # Entry point
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 📝 Scripts có sẵn

| Script    | Lệnh            | Mô tả               |
| --------- | --------------- | ------------------- |
| **dev**   | `npm run dev`   | Chạy dev server     |
| **build** | `npm run build` | Build production    |
| **lint**  | `npm run lint`  | Kiểm tra lỗi ESLint |

---

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

**Chúc bạn sử dụng vui vẻ! 🎉**
