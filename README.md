# 🚀 MinIO File CRUD Demo

A modern fullstack application for uploading, previewing, updating, downloading, and deleting files using MinIO (S3-compatible), PostgreSQL, and React + Vite.

## Features

- 📦 Upload files (images, docs, etc.)
- 🖼️ Preview images instantly
- 📝 Update/replace files
- ⬇️ Download files
- 🗑️ Delete files
- ⚡ Fast, responsive UI (React + Vite)
- 🗄️ MinIO for object storage
- 🐘 PostgreSQL for metadata

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, Prisma
- **Storage:** MinIO (S3-compatible)
- **Database:** PostgreSQL
- **Containerization:** Docker Compose

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/driannaird/minio-express-react.git
cd minio-express-react
```

### 2. Copy environment variables

```bash
cp .env.example .env
```

Edit `.env` as needed.

### 3. Start services with Docker Compose

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

### 5. Run the backend

```bash
cd ../server
npm run dev
```

### 6. Run the frontend

```bash
cd ../client
npm run dev
```

### 7. Access the app

Open [http://localhost:5173](http://localhost:5173) in your browser.

## API Endpoints

- `POST   /api/files/upload` — Upload file
- `GET    /api/files` — List all files
- `GET    /api/files/:id` — Get file metadata
- `GET    /api/files/download/:id` — Download file
- `PUT    /api/files/:id` — Update file
- `DELETE /api/files/:id` — Delete file
- `GET    /api/files/presigned-url/:id` - Presigned Url
- `GET    /api/files/preview/:id` — Preview image

## MinIO Console

- Access buckets and files at [http://localhost:9001/buckets](http://localhost:9001/buckets)

## License

MIT

---

Made with ❤️ by drian
