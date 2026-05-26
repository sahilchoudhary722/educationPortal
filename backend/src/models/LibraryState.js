import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: String, default: "Available" },
    issuedToId: { type: Number, default: null },
    issueDate: { type: String, default: "" },
    returnDate: { type: String, default: "" },
    finePerDay: { type: Number, default: 5 },
    issueHistory: { type: [mongoose.Schema.Types.Mixed], default: [] },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
  },
  { _id: false },
);

const requestSchema = new mongoose.Schema(
  {
    bookId: { type: Number, required: true },
    studentId: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    requestedDate: { type: String, required: true },
  },
  { _id: false },
);

const reservationSchema = new mongoose.Schema(
  {
    bookId: { type: Number, required: true },
    studentId: { type: Number, required: true },
    reservedDate: { type: String, required: true },
  },
  { _id: false },
);

const ratingSchema = new mongoose.Schema(
  {
    bookId: { type: Number, required: true },
    studentId: { type: Number, required: true },
    rating: { type: Number, required: true },
    review: { type: String, default: "" },
    date: { type: String, required: true },
  },
  { _id: false },
);

const libraryStateSchema = new mongoose.Schema(
  {
    books: { type: [bookSchema], default: [] },
    requests: { type: [requestSchema], default: [] },
    reservations: { type: [reservationSchema], default: [] },
    wishlists: { type: mongoose.Schema.Types.Mixed, default: {} },
    fines: { type: mongoose.Schema.Types.Mixed, default: {} },
    ratings: { type: [ratingSchema], default: [] },
  },
  { timestamps: true },
);

const LibraryState = mongoose.model("LibraryState", libraryStateSchema);
export default LibraryState;
