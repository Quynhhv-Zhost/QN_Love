# 💕 Love Website - Website Tình Yêu

Website tình yêu với hiệu ứng lãng mạn, quản lý ảnh và admin panel đầy đủ tính năng.

## ✨ Tính năng

### Frontend
- 🎨 Hiệu ứng gradient background tự động chuyển màu
- 💖 Trái tim đập với animation mượt mà
- 🎈 Trái tim bay lơ lửng với hiệu ứng 3D
- ✨ Hạt particles lấp lánh
- 🖼️ Gallery ảnh với nhiều chế độ xem (grid/masonry/slideshow)
- 📱 Responsive design, tối ưu cho mobile
- ⚡ GPU acceleration cho hiệu suất cao

### Admin Panel
- 🔐 Đăng nhập bảo mật với JWT
- 📤 Upload ảnh với preview
- 🗂️ Quản lý ảnh theo danh mục (Ảnh đôi, Đồ ăn, Du lịch)
- 🗑️ Xóa ảnh trực tiếp từ dashboard
- 📊 Thống kê số lượng ảnh
- 🎯 Quản lý banner và caption
- 📅 Cài đặt ngày yêu

## 🚀 Cài đặt

### Yêu cầu
- Node.js 14+
- npm hoặc yarn
- OpenLiteSpeed (nếu deploy production)

### Cài đặt local

```bash
# Clone repository
git clone <repository-url>
cd love-website

# Cài đặt dependencies
npm install

# Chạy server
npm start
```

Server sẽ chạy tại `http://localhost:3000`

## 📁 Cấu trúc thư mục

```
love-website/
├── admin/                  # Admin panel
│   ├── login.html         # Trang đăng nhập
│   ├── dashboard.html     # Dashboard quản lý
│   └── upload.html        # Upload ảnh
├── public/                # Frontend
│   ├── css/
│   │   ├── main.css       # CSS chính
│   │   └── animations/    # CSS animations
│   ├── js/
│   │   ├── main.js        # JavaScript chính
│   │   └── effects/       # Hiệu ứng JS
│   ├── uploads/           # Thư mục ảnh upload
│   └── index.html         # Trang chủ
├── server/                # Backend
│   ├── app.js            # Express server
│   └── data/             # JSON database
│       ├── admin.json    # Thông tin admin
│       ├── photos.json   # Dữ liệu ảnh
│       └── settings.json # Cài đặt
└── package.json
```

## 🔧 Cấu hình

### Admin mặc định
- Username: `qnlove`
- Password: `qnlove@123!@#`

### Đổi mật khẩu admin

```bash
# Tạo file hash-password.js
node -e "const bcrypt = require('bcryptjs'); const fs = require('fs'); const hash = bcrypt.hashSync('YOUR_PASSWORD', 10); fs.writeFileSync('server/data/admin.json', JSON.stringify({username: 'qnlove', password: hash}, null, 2));"
```

## 🌐 Deploy lên Production

### Với OpenLiteSpeed + aaPanel

1. Upload code lên server:
```bash
cd /www/wwwroot/qnlove.id.vn
git clone <repository-url> .
npm install
```

2. Cấu hình OpenLiteSpeed (xem file `openlitespeed-vhost.conf`)

3. Chạy với PM2:
```bash
# Cài đặt PM2
npm install -g pm2

# Chạy app
pm2 start server/app.js --name love-website

# Tự động khởi động khi reboot
pm2 startup
pm2 save
```

4. Kiểm tra logs:
```bash
pm2 logs love-website
pm2 status
```

Chi tiết xem file `DEPLOY.md` và `OPENLITESPEED-CONFIG.md`

## 🎯 API Endpoints

### Public
- `GET /` - Trang chủ
- `GET /api/photos` - Lấy danh sách ảnh
- `GET /api/banner` - Lấy thông tin banner
- `GET /api/settings` - Lấy cài đặt

### Admin (yêu cầu JWT token)
- `POST /api/admin/login` - Đăng nhập
- `GET /api/admin/dashboard` - Dashboard data
- `POST /api/admin/upload` - Upload ảnh
- `DELETE /api/admin/photos/:id` - Xóa ảnh
- `PUT /api/admin/love-date` - Cập nhật ngày yêu
- `PUT /api/admin/banner-caption` - Cập nhật caption
- `POST /api/admin/banner-photo` - Upload banner

## 🎨 Tối ưu hiệu suất

- ✅ GPU acceleration với `translate3d()`
- ✅ Giảm số lượng trái tim bay (Mobile: 6, Desktop: 12)
- ✅ Tối ưu animation với `will-change`
- ✅ Không sử dụng cache để luôn hiển thị ảnh mới nhất
- ✅ Responsive và tối ưu cho mobile

## 📱 Trình duyệt hỗ trợ

- Chrome/Edge (khuyến nghị)
- Firefox
- Safari
- Mobile browsers

## 🛠️ Công nghệ sử dụng

- **Backend**: Node.js, Express.js
- **Authentication**: JWT, bcryptjs
- **File Upload**: Multer
- **Database**: JSON files
- **Frontend**: Vanilla JavaScript, CSS3
- **Animations**: CSS3 Animations, GPU acceleration

## 📝 License

MIT License

## 👨‍💻 Author

Made with ❤️ for love

---

💕 **Chúc bạn có những khoảnh khắc tình yêu đẹp!** 💕
