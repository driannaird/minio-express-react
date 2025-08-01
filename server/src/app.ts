import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import uploadRouter from "./routes/upload";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", uploadRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
