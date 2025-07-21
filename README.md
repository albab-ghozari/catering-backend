# 🍽️ Web App Catering - Backend

Ini adalah backend API untuk aplikasi pemesanan makanan berbasis web seperti layanan McDonald's. Backend ini dibuat menggunakan **Node.js** dengan framework **Express**, serta menggunakan **PostgreSQL** untuk penyimpanan data.

---

## 📦 Fitur

- [x] Register & Login (User dan Admin)
- [x] Manajemen Menu (CRUD menu oleh Admin)
- [x] Pemesanan makanan oleh User
- [x] Riwayat pesanan per user
- [x] Manajemen status pesanan (Antre, Diproses, Selesai)
- [x] Panel admin untuk mengelola pesanan masuk
- [x] Notifikasi real-time via Socket.io

---

## 🛠️ Teknologi yang Digunakan

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- Socket.io
- JWT (JSON Web Token) untuk autentikasi
- Bcrypt untuk enkripsi password

---

## 📁 Struktur Folder

├── controllers/
│ ├── authController.js
│ ├── menuController.js
│ ├── orderController.js
│ └── ...
├── middleware/
│ ├── verifyToken.js
│ ├── verifyUser.js
│ └── verifyAdmin.js
├── models/
│ ├── index.js
│ ├── User.js
│ ├── Menu.js
│ ├── Order.js
│ └── OrderItem.js
├── routes/
│ ├── auth.js
│ ├── menu.js
│ └── order.js
├── socket/
│ └── orderSocket.js
├── app.js
└── server.js


---

## 🚀 Cara Menjalankan Backend

1. **Clone repository**
   ```bash
   git clone https://github.com/username/web-catering-backend.git
   cd web-catering-backend

2. **install depedencies**
   ```bash
   npm install

3. **buat file environment**
    ```bash
   cp .env.example .env

4. **isi file .env**
    PORT=5000
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=nama_database
    DB_USER=postgres
    DB_PASSWORD=yourpassword
    JWT_SECRET=your_jwt_secret

5. **sync database**
    ```bash
    npx sequelize-cli db:migrate

6. **jalankan server**
    ```bash
    npm run dev

🔐 Autentikasi
Gunakan Bearer Token di header setiap request ke endpoint yang butuh autentikasi.

Role-based access: admin dan user.

📡 Endpoint Utama
Auth
POST /api/auth/register

POST /api/auth/login

Menu
GET /api/menu

POST /api/menu (Admin only)

PUT /api/menu/:id (Admin only)

DELETE /api/menu/:id (Admin only)

Order
POST /api/order (User only)

GET /api/order/my (User only)

GET /api/order (Admin only)

PUT /api/order/:id/status (Admin only)

🤝 Kontribusi
Fork repo ini

Buat branch baru: git checkout -b fitur-anda

Commit perubahan: git commit -m "Menambahkan fitur ..."

Push ke branch: git push origin fitur-anda

Buat Pull Request

📄 Lisensi
MIT License © 2025 Albab Ghozhari


