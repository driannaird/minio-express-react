import minioClient from "./minio";

const bucketName = process.env.MINIO_BUCKET_NAME || "my-files-bucket";

export async function ensureBucketExists() {
  const exists = await minioClient.bucketExists(bucketName);
  if (!exists) {
    await minioClient.makeBucket(bucketName, "us-east-1");
    console.log(`Bucket '${bucketName}' created successfully.`);
  } else {
    console.log(`Bucket '${bucketName}' already exists.`);
  }
}
