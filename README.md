🛍️ Shop Management System – Fullstack (NodeJS + MongoDB)
📖 Giới thiệu

Đây là đồ án cuối kỳ môn Ngôn ngữ phát triển ứng dụng mới, gồm:

Backend (NodeJS + MongoDB) — xây dựng RESTful API quản lý sản phẩm & đơn hàng mini.

Frontend (html/css) — giao diện người dùng đơn giản để tương tác với API.

👉 Mục tiêu: Quản lý sản phẩm, đặt hàng, xóa mềm dữ liệu và phân quyền admin/user.

⚙️ Công nghệ sử dụng
🔹 Backend

Node.js – runtime chính.

Express.js – framework REST API.

MongoDB Atlas – cơ sở dữ liệu NoSQL.

Mongoose – ORM cho MongoDB.

dotenv – quản lý biến môi trường.

cors – cho phép FE truy cập API.

nodemon – tự restart server khi code thay đổi.

🔹 Frontend

Axios / Fetch API – gọi API tới backend.

TailwindCSS / Bootstrap – giao diện đơn giản, responsive.

📂 Cấu trúc thư mục
shop-project/
│
├── backend/                     # RESTful API (NodeJS + Express + MongoDB)
│   ├── config/                  # Kết nối MongoDB
│   ├── controllers/             # Xử lý logic CRUD
│   ├── models/                  # Định nghĩa Schema
│   ├── routes/                  # Routes RESTful
│   ├── middlewares/             # Xác thực (JWT, role)
│   ├── utils/                   # Helper, response handler
│   ├── .env                     # Biến môi trường (PORT, MONGO_URI)
│   ├── package.json
│   └── server.js                # Điểm khởi chạy backend
│
├── frontend/                    # Giao diện client (React/Vue)
│   ├── src/                     # Mã nguồn FE
│   ├── public/
│   ├── package.json│
├── .gitignore
└── README.md                    # Tài liệu dự án

🚀 Cách chạy dự án
1️⃣ Backend (API)
cd backend
npm install


Tạo file .env:

PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/shopdb


Chạy server:

npm start


Sau khi chạy thành công:

✅ MongoDB connected
🚀 Server running on port 3000


API mặc định:
http://localhost:3000/api/products

2️⃣ Frontend (Client)
cd frontend
npm install
npm run dev

🧠 Ghi chú

Dự án tách riêng FE & BE, dễ deploy.

BE có thể mở rộng thêm JWT login, Order, User.

FE chỉ cần gọi API từ http://localhost:3000/api.

👨‍💻 Tác giả

Sinh viên: Dương Bình Cương

Lớp: 22DTHD8

Giảng viên: Nguyễn Thanh Tùng

Trường: HUTECH

Môn: Ngôn ngữ phát triển ứng dụng mới

🧾 License

MIT © 2025 – HUTECH University