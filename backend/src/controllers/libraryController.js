import LibraryState from "../models/LibraryState.js";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-").map(Number);
  if (!year || !month || !day) return "";

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${day.toString().padStart(2, "0")} ${months[month - 1]} ${year}`;
};

const calculateOverdueDays = (returnDate) => {
  if (!returnDate) return 0;

  try {
    const [day, month, year] = returnDate.split(" ");
    const monthIndex = new Date(`${month} 1`).getMonth();
    const returnDateObj = new Date(
      parseInt(year, 10),
      monthIndex,
      parseInt(day, 10),
    );
    const today = new Date();
    const diffTime = today - returnDateObj;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  } catch {
    return 0;
  }
};

const getLibraryState = async () => {
  const library = await LibraryState.findOne();
  if (!library) {
    throw new Error("Library state not initialized");
  }
  return library;
};

export const getLibrary = async (req, res) => {
  const library = await getLibraryState();
  res.json(library);
};

export const requestBook = async (req, res) => {
  const { bookId, studentId } = req.body;
  const library = await getLibraryState();

  const existing = library.requests.find(
    (item) =>
      item.bookId === Number(bookId) && item.studentId === Number(studentId),
  );

  if (!existing) {
    library.requests.push({
      bookId: Number(bookId),
      studentId: Number(studentId),
      status: "Pending",
      requestedDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    });
  }

  await library.save();
  res.json(library);
};

export const approveRequest = async (req, res) => {
  const { bookId, studentId, issueDate, returnDate } = req.body;
  const library = await getLibraryState();
  const book = library.books.find((item) => item.id === Number(bookId));

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  if (book.status === "Issued") {
    res.status(400);
    throw new Error("Book is already issued");
  }

  book.status = "Issued";
  book.issuedToId = Number(studentId);
  book.issueDate =
    issueDate || formatDate(new Date().toISOString().split("T")[0]);

  if (returnDate) {
    book.returnDate = returnDate;
  } else {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 7);
    book.returnDate = formatDate(nextDate.toISOString().split("T")[0]);
  }

  if (!book.issueHistory) {
    book.issueHistory = [];
  }

  book.issueHistory.push({
    studentId: Number(studentId),
    issuedDate: book.issueDate,
    returnedDate: null,
  });

  library.requests = library.requests.filter(
    (reqItem) =>
      !(
        reqItem.bookId === Number(bookId) &&
        reqItem.studentId === Number(studentId)
      ),
  );

  await library.save();
  res.json(library);
};

export const rejectRequest = async (req, res) => {
  const { bookId, studentId } = req.body;
  const library = await getLibraryState();

  library.requests = library.requests.filter(
    (item) =>
      !(item.bookId === Number(bookId) && item.studentId === Number(studentId)),
  );

  await library.save();
  res.json(library);
};

export const returnBook = async (req, res) => {
  const { bookId } = req.body;
  const library = await getLibraryState();
  const book = library.books.find((item) => item.id === Number(bookId));

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  const overdueDays = calculateOverdueDays(book.returnDate);

  if (overdueDays > 0) {
    const fineAmount = overdueDays * (book.finePerDay || 5);
    const studentId = Number(book.issuedToId);
    library.fines[studentId] = (library.fines[studentId] || 0) + fineAmount;
  }

  if (book.issueHistory?.length) {
    const lastIssue = book.issueHistory[book.issueHistory.length - 1];
    if (lastIssue && !lastIssue.returnedDate) {
      lastIssue.returnedDate = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  }

  const nextReservation = library.reservations.find(
    (reservation) => reservation.bookId === book.id,
  );

  if (nextReservation) {
    const today = new Date();
    const nextReturnDate = new Date();
    nextReturnDate.setDate(today.getDate() + 7);

    book.status = "Issued";
    book.issuedToId = Number(nextReservation.studentId);
    book.issueDate = formatDate(today.toISOString().split("T")[0]);
    book.returnDate = formatDate(nextReturnDate.toISOString().split("T")[0]);

    library.reservations = library.reservations.filter(
      (reservation) =>
        !(
          reservation.bookId === nextReservation.bookId &&
          reservation.studentId === nextReservation.studentId
        ),
    );
  } else {
    book.status = "Available";
    book.issuedToId = null;
    book.issueDate = "";
    book.returnDate = "";
  }

  await library.save();
  res.json(library);
};

export const addToWishlist = async (req, res) => {
  const { studentId, bookId } = req.body;
  const library = await getLibraryState();

  const key = String(studentId);
  library.wishlists[key] = library.wishlists[key] || [];

  if (!library.wishlists[key].includes(Number(bookId))) {
    library.wishlists[key].push(Number(bookId));
  }

  await library.save();
  res.json(library);
};

export const removeFromWishlist = async (req, res) => {
  const { studentId, bookId } = req.body;
  const library = await getLibraryState();
  const key = String(studentId);

  library.wishlists[key] = (library.wishlists[key] || []).filter(
    (id) => id !== Number(bookId),
  );

  await library.save();
  res.json(library);
};

export const reserveBook = async (req, res) => {
  const { studentId, bookId } = req.body;
  const library = await getLibraryState();

  const alreadyReserved = library.reservations.some(
    (item) =>
      item.bookId === Number(bookId) && item.studentId === Number(studentId),
  );

  if (!alreadyReserved) {
    library.reservations.push({
      bookId: Number(bookId),
      studentId: Number(studentId),
      reservedDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    });
  }

  await library.save();
  res.json(library);
};

export const cancelReservation = async (req, res) => {
  const { studentId, bookId } = req.body;
  const library = await getLibraryState();

  library.reservations = library.reservations.filter(
    (item) =>
      !(item.bookId === Number(bookId) && item.studentId === Number(studentId)),
  );

  await library.save();
  res.json(library);
};

export const addRating = async (req, res) => {
  const { bookId, studentId, rating, review } = req.body;
  const library = await getLibraryState();
  const book = library.books.find((item) => item.id === Number(bookId));

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  const existing = library.ratings.find(
    (item) =>
      item.bookId === Number(bookId) && item.studentId === Number(studentId),
  );

  if (existing) {
    res.status(400);
    throw new Error("Student has already rated this book");
  }

  library.ratings.push({
    bookId: Number(bookId),
    studentId: Number(studentId),
    rating: Number(rating),
    review: review || "",
    date: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  });

  const bookRatings = library.ratings.filter(
    (item) => item.bookId === Number(bookId),
  );
  const average =
    bookRatings.reduce((sum, item) => sum + item.rating, 0) /
    bookRatings.length;

  book.rating = Number(average.toFixed(1));
  book.reviews = bookRatings.length;

  await library.save();
  res.json(library);
};

export const payFine = async (req, res) => {
  const { studentId, amount } = req.body;
  const library = await getLibraryState();
  const key = String(studentId);

  library.fines[key] = Math.max(0, (library.fines[key] || 0) - Number(amount));

  await library.save();
  res.json(library);
};
