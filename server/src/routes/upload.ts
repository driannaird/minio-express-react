import express from "express";
import upload from "../lib/multer";
import minioClient from "../lib/minio";
import prisma from "../lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { ensureBucketExists } from "../lib/bucket";

const router = express.Router();
const bucketName = process.env.MINIO_BUCKET_NAME || "my-files-bucket";

// Upload file
router.post("/files/upload", upload.single("file"), async (req, res) => {
  try {
    await ensureBucketExists();
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    const file = req.file;
    const fileId = uuidv4();
    const objectName = `${fileId}-${file.originalname}`;
    await minioClient.putObject(
      bucketName,
      objectName,
      file.buffer,
      file.size,
      {
        "Content-Type": file.mimetype,
      }
    );
    const newFile = await prisma.file.create({
      data: {
        id: fileId,
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        bucketName,
        path: objectName,
      },
    });
    res
      .status(201)
      .json({ message: "File uploaded successfully", file: newFile });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to upload file", error: error.message });
  }
});

// List files
router.get("/files", async (req, res) => {
  try {
    const files = await prisma.file.findMany({
      select: {
        id: true,
        filename: true,
        mimetype: true,
        size: true,
        uploadDate: true,
        url: true,
      },
    });
    res.status(200).json(files);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to list files", error: error.message });
  }
});

// Download file
router.get("/files/download/:id", async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await prisma.file.findUnique({ where: { id: fileId } });
    if (!file) {
      return res.status(404).json({ message: "File not found." });
    }
    const dataStream = await minioClient.getObject(file.bucketName, file.path);
    res.setHeader("Content-Type", file.mimetype);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.filename}"`
    );
    res.setHeader("Content-Length", file.size.toString());
    dataStream.pipe(res);
    dataStream.on("error", (err) => {
      res.status(500).json({ message: "Error streaming file from storage." });
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to download file", error: error.message });
  }
});

// Preview file (inline, not download)
router.get("/files/preview/:id", async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await prisma.file.findUnique({ where: { id: fileId } });
    if (!file) {
      return res.status(404).json({ message: "File not found." });
    }
    const dataStream = await minioClient.getObject(file.bucketName, file.path);
    res.setHeader("Content-Type", file.mimetype);
    res.setHeader("Content-Length", file.size.toString());
    // No Content-Disposition header, so browser will preview inline if supported
    dataStream.pipe(res);
    dataStream.on("error", (err) => {
      res.status(500).json({ message: "Error streaming file from storage." });
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to preview file", error: error.message });
  }
});

// Presigned URL
router.get("/files/presigned-url/:id", async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await prisma.file.findUnique({ where: { id: fileId } });
    if (!file) {
      return res.status(404).json({ message: "File not found." });
    }
    const presignedUrl = await minioClient.presignedGetObject(
      file.bucketName,
      file.path,
      3600,
      { "response-content-type": file.mimetype }
    );
    res.status(200).json({ url: presignedUrl });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to generate presigned URL",
      error: error.message,
    });
  }
});

// Update file
router.put("/files/update/:id", upload.single("file"), async (req, res) => {
  try {
    const fileId = req.params.id;
    const existingFile = await prisma.file.findUnique({
      where: { id: fileId },
    });
    if (!existingFile) {
      return res.status(404).json({ message: "File not found." });
    }
    let newObjectName = existingFile.path;
    let newFileSize = existingFile.size;
    let newMimeType = existingFile.mimetype;
    let newFilename = existingFile.filename;
    if (req.file) {
      await minioClient.removeObject(
        existingFile.bucketName,
        existingFile.path
      );
      newObjectName = `${fileId}-${req.file.originalname}`;
      await minioClient.putObject(
        existingFile.bucketName,
        newObjectName,
        req.file.buffer,
        req.file.size,
        {
          "Content-Type": req.file.mimetype,
        }
      );
      newFileSize = req.file.size;
      newMimeType = req.file.mimetype;
      newFilename = req.file.originalname;
    }
    const updatedFile = await prisma.file.update({
      where: { id: fileId },
      data: {
        filename: newFilename,
        mimetype: newMimeType,
        size: newFileSize,
        path: newObjectName,
      },
    });
    res
      .status(200)
      .json({ message: "File updated successfully", file: updatedFile });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to update file", error: error.message });
  }
});

// Delete file
router.delete("/files/delete/:id", async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await prisma.file.findUnique({ where: { id: fileId } });
    if (!file) {
      return res.status(404).json({ message: "File not found." });
    }
    await minioClient.removeObject(file.bucketName, file.path);
    await prisma.file.delete({ where: { id: fileId } });
    res.status(200).json({ message: "File deleted successfully." });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to delete file", error: error.message });
  }
});
// ...existing code...

export default router;
