import { Client } from "minio";
import dotenv from "dotenv";

dotenv.config();

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT || "9000", 10),
  useSSL: false, // Set to true if using SSL
  accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
});

export default minioClient;
