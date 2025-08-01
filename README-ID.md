# 🚀 Demo CRUD File MinIO

Aplikasi fullstack modern untuk upload, preview, update, download, dan hapus file menggunakan MinIO (S3-compatible), PostgreSQL, dan React + Vite.

## Fitur

- 📦 Upload file (gambar, dokumen, dll)
- 🖼️ Preview gambar langsung
- 📝 Update/ganti file
- ⬇️ Download file
- 🗑️ Hapus file
- ⚡ UI responsif & cepat (React + Vite)
- 🗄️ MinIO sebagai object storage
- 🐘 PostgreSQL untuk metadata file

## Teknologi

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, Prisma
- **Storage:** MinIO (S3-compatible)
- **Database:** PostgreSQL
- **Containerization:** Docker Compose

## Cara Memulai

### 1. Clone repository

```bash
git clone https://github.com/driannaird/minio-express-react.git
cd minio-express-react
```

### 2. Salin file environment

```bash
cp .env.example .env
```

Edit `.env` sesuai kebutuhan.

### 3. Jalankan service dengan Docker Compose

```bash
docker-compose up -d
```

- MinIO Console: [http://localhost:9001](http://localhost:9001)
- PostgreSQL: `localhost:5432`

### 4. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 5. Jalankan backend

```bash
cd ../server
npm run dev
```

### 6. Jalankan frontend

```bash
cd ../client
npm run dev
```

### 7. Akses aplikasi

Buka [http://localhost:5173](http://localhost:5173) di browser Anda.

## API Endpoint

- `POST   /api/files/upload` — Upload file
- `GET    /api/files` — List semua file
- `GET    /api/files/:id` — Ambil metadata file
- `GET    /api/files/download/:id` — Download file
- `PUT    /api/files/:id` — Update file
- `DELETE /api/files/:id` — Hapus file
- `GET    /api/files/presigned-url/:id` - Presigned Url
- `GET    /api/files/preview/:id` — Preview gambar

## MinIO Console

- Akses bucket dan file di [http://localhost:9001/buckets](http://localhost:9001/buckets)

## Lisensi

MIT

---

Dibuat dengan ❤️ oleh drian
