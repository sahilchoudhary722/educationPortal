import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  getAssignments,
  addAssignment,
  submitAssignment,
} from "../controllers/assignmentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadDir = path.join(__dirname, "..", "..", "uploads");
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/gif",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Unsupported file type. Allowed types: PDF, DOC, DOCX, JPG, PNG, GIF.",
      ),
    );
  }
};

const upload = multer({ storage, fileFilter });

const router = express.Router();

router.get("/", asyncHandler(protect), asyncHandler(getAssignments));
router.post(
  "/",
  asyncHandler(protect),
  upload.single("assignmentFile"),
  asyncHandler(addAssignment),
);
router.post(
  "/:id/submit",
  asyncHandler(protect),
  upload.single("submissionFile"),
  asyncHandler(submitAssignment),
);

export default router;
