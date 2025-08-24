import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { auth } from "../middleware/auth.js";

const r = Router();
const uploadRoot = path.join(process.cwd(), process.env.UPLOAD_DIR || "uploads");
fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb)=> cb(null, path.join(uploadRoot, "resumes")),
  filename: (req, file, cb)=> {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  }
});
const fileFilter = (req,file,cb)=>{
  const ok = ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.mimetype);
  cb(ok ? null : new Error("Only PDF/DOC/DOCX allowed"), ok);
};
const upload = multer({ storage, fileFilter });

r.post("/resume", auth, upload.single("file"), (req,res)=>{
  const url = `/uploads/resumes/${req.file.filename}`;
  res.json({ url });
});

export default r;
