import express from "express";
import {
  getLibrary,
  requestBook,
  approveRequest,
  rejectRequest,
  returnBook,
  addToWishlist,
  removeFromWishlist,
  reserveBook,
  cancelReservation,
  addRating,
  payFine,
} from "../controllers/libraryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(protect), asyncHandler(getLibrary));
router.post("/request", asyncHandler(protect), asyncHandler(requestBook));
router.post("/approve", asyncHandler(protect), asyncHandler(approveRequest));
router.post("/reject", asyncHandler(protect), asyncHandler(rejectRequest));
router.post("/return", asyncHandler(protect), asyncHandler(returnBook));
router.post("/wishlist", asyncHandler(protect), asyncHandler(addToWishlist));
router.post(
  "/wishlist/remove",
  asyncHandler(protect),
  asyncHandler(removeFromWishlist),
);
router.post("/reserve", asyncHandler(protect), asyncHandler(reserveBook));
router.post(
  "/reserve/cancel",
  asyncHandler(protect),
  asyncHandler(cancelReservation),
);
router.post("/rating", asyncHandler(protect), asyncHandler(addRating));
router.post("/payfine", asyncHandler(protect), asyncHandler(payFine));

export default router;
