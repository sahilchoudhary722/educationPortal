import express from "express";
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
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

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
