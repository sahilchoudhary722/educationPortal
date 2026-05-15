import { createSlice } from "@reduxjs/toolkit";
import libraryData from "../../data/libraryData";

// =========================
// LOAD / SAVE LOCAL STORAGE
// =========================

const loadState = () => {
  try {
    const data = localStorage.getItem("library");

    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.log("Load Error:", error);
    return null;
  }
};

const saveState = (state) => {
  try {
    localStorage.setItem(
      "library",
      JSON.stringify({
        books: state.books,
        requests: state.requests,
        reservations: state.reservations,
        wishlists: state.wishlists,
        fines: state.fines,
        ratings: state.ratings,
      }),
    );
  } catch (error) {
    console.log("Save Error:", error);
  }
};

// =========================
// INITIAL STATE
// =========================

const initialState = loadState() || {
  books: libraryData || [],
  requests: [],
  reservations: [],
  wishlists: {},
  fines: {},
  ratings: {},
};

// =========================
// DATE HELPERS
// =========================

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const calculateOverdayDays = (returnDate) => {
  if (!returnDate) return 0;

  try {
    const [day, month, year] = returnDate.split(" ");

    const monthIndex = new Date(
      `${month} 1`,
    ).getMonth();

    const returnDateObj = new Date(
      parseInt(year),
      monthIndex,
      parseInt(day),
    );

    const today = new Date();

    const diffTime = today - returnDateObj;

    const diffDays = Math.floor(
      diffTime / (1000 * 60 * 60 * 24),
    );

    return diffDays > 0 ? diffDays : 0;
  } catch {
    return 0;
  }
};

// =========================
// SLICE
// =========================

const librarySlice = createSlice({
  name: "library",

  initialState,

  reducers: {
    // =========================
    // REQUEST BOOK
    // =========================

    requestBook: (state, action) => {
      const { bookId, studentId } =
        action.payload;

      const alreadyRequested =
        state.requests.find(
          (req) =>
            req.bookId === bookId &&
            req.studentId === studentId,
        );

      if (alreadyRequested) return;

      state.requests.push({
        bookId,
        studentId,
        status: "Pending",
        requestedDate: formatDate(new Date()),
      });

      saveState(state);
    },

    // =========================
    // APPROVE / ISSUE BOOK
    // =========================

    approveRequest: (state, action) => {
      const {
        bookId,
        studentId,
        issueDate,
        returnDate,
      } = action.payload;

      const book = state.books.find(
        (b) => b.id === bookId,
      );

      if (!book) return;

      if (book.status === "Issued")
        return;

      book.status = "Issued";

      book.issuedToId =
        Number(studentId);

      book.issueDate =
        issueDate ||
        formatDate(new Date());

      const nextDate = new Date();

      nextDate.setDate(
        nextDate.getDate() + 7,
      );

      book.returnDate =
        returnDate ||
        formatDate(nextDate);

      // issue history

      if (!book.issueHistory) {
        book.issueHistory = [];
      }

      book.issueHistory.push({
        studentId:
          Number(studentId),
        issuedDate: book.issueDate,
        returnedDate: null,
      });

      // remove request

      state.requests =
        state.requests.filter(
          (req) =>
            !(
              req.bookId === bookId &&
              req.studentId ===
                Number(studentId)
            ),
        );

      saveState(state);
    },

    // =========================
    // REJECT REQUEST
    // =========================

    rejectRequest: (state, action) => {
      const { bookId, studentId } =
        action.payload;

      state.requests =
        state.requests.filter(
          (req) =>
            !(
              req.bookId === bookId &&
              req.studentId ===
                Number(studentId)
            ),
        );

      saveState(state);
    },

    // =========================
    // RETURN BOOK
    // =========================

    returnBook: (state, action) => {
      const bookId = action.payload;

      const bookIndex =
        state.books.findIndex(
          (book) =>
            book.id === bookId,
        );

      if (bookIndex === -1) return;

      const book =
        state.books[bookIndex];

      // only issued books can return

      if (book.status !== "Issued")
        return;

      const studentId =
        book.issuedToId;

      // =========================
      // OVERDUE FINE
      // =========================

      const overdueDays =
        calculateOverdayDays(
          book.returnDate,
        );

      if (overdueDays > 0) {
        const fine =
          overdueDays *
          (book.finePerDay || 5);

        if (
          !state.fines[studentId]
        ) {
          state.fines[studentId] = 0;
        }

        state.fines[studentId] +=
          fine;
      }

      // =========================
      // ISSUE HISTORY UPDATE
      // =========================

      if (
        book.issueHistory &&
        book.issueHistory.length > 0
      ) {
        const lastIssue =
          book.issueHistory[
            book.issueHistory
              .length - 1
          ];

        if (
          lastIssue &&
          !lastIssue.returnedDate
        ) {
          lastIssue.returnedDate =
            formatDate(
              new Date(),
            );
        }
      }

      // =========================
      // CHECK RESERVATIONS
      // =========================

      const nextReservation =
        state.reservations.find(
          (reservation) =>
            reservation.bookId ===
            book.id,
        );

      // =========================
      // AUTO ISSUE RESERVED USER
      // =========================

      if (nextReservation) {
        const today =
          new Date();

        const nextReturnDate =
          new Date();

        nextReturnDate.setDate(
          today.getDate() + 7,
        );

        state.books[bookIndex] = {
          ...book,

          status: "Issued",

          issuedToId:
            nextReservation.studentId,

          issueDate:
            formatDate(today),

          returnDate:
            formatDate(
              nextReturnDate,
            ),
        };

        // remove reservation

        state.reservations =
          state.reservations.filter(
            (reservation) =>
              !(
                reservation.bookId ===
                  nextReservation.bookId &&
                reservation.studentId ===
                  nextReservation.studentId
              ),
          );
      } else {
        // =========================
        // MAKE AVAILABLE
        // =========================

        state.books[bookIndex] = {
          ...book,

          status: "Available",

          issuedToId: null,

          issueDate: "",

          returnDate: "",
        };
      }

      saveState(state);
    },

    // =========================
    // WISHLIST
    // =========================

    addToWishlist: (
      state,
      action,
    ) => {
      const {
        studentId,
        bookId,
      } = action.payload;

      if (
        !state.wishlists[
          studentId
        ]
      ) {
        state.wishlists[
          studentId
        ] = [];
      }

      const exists =
        state.wishlists[
          studentId
        ].includes(bookId);

      if (!exists) {
        state.wishlists[
          studentId
        ].push(bookId);
      }

      saveState(state);
    },

    removeFromWishlist: (
      state,
      action,
    ) => {
      const {
        studentId,
        bookId,
      } = action.payload;

      if (
        state.wishlists[
          studentId
        ]
      ) {
        state.wishlists[
          studentId
        ] =
          state.wishlists[
            studentId
          ].filter(
            (id) =>
              id !== bookId,
          );
      }

      saveState(state);
    },

    // =========================
    // RESERVE BOOK
    // =========================

    reserveBook: (
      state,
      action,
    ) => {
      const {
        bookId,
        studentId,
      } = action.payload;

      const alreadyReserved =
        state.reservations.find(
          (reservation) =>
            reservation.bookId ===
              bookId &&
            reservation.studentId ===
              studentId,
        );

      if (alreadyReserved)
        return;

      state.reservations.push({
        bookId,
        studentId,
        reservedDate:
          formatDate(
            new Date(),
          ),
      });

      saveState(state);
    },

    cancelReservation: (
      state,
      action,
    ) => {
      const {
        bookId,
        studentId,
      } = action.payload;

      state.reservations =
        state.reservations.filter(
          (reservation) =>
            !(
              reservation.bookId ===
                bookId &&
              reservation.studentId ===
                studentId
            ),
        );

      saveState(state);
    },

    // =========================
    // ADD RATING
    // =========================

    addRating: (state, action) => {
      const {
        bookId,
        studentId,
        rating,
        review,
      } = action.payload;

      if (!state.ratings[bookId]) {
        state.ratings[bookId] = [];
      }

      const alreadyRated =
        state.ratings[
          bookId
        ].find(
          (r) =>
            r.studentId ===
            studentId,
        );

      if (alreadyRated) return;

      state.ratings[bookId].push({
        studentId,
        rating,
        review,
        date: formatDate(
          new Date(),
        ),
      });

      const book =
        state.books.find(
          (b) =>
            b.id === bookId,
        );

      if (book) {
        const allRatings =
          state.ratings[
            bookId
          ].map(
            (r) => r.rating,
          );

        const avg =
          allRatings.reduce(
            (a, b) => a + b,
            0,
          ) /
          allRatings.length;

        book.rating =
          Number(
            avg.toFixed(1),
          );

        book.reviews =
          allRatings.length;
      }

      saveState(state);
    },

    // =========================
    // PAY FINE
    // =========================

    payFine: (state, action) => {
      const {
        studentId,
        amount,
      } = action.payload;

      if (
        state.fines[studentId]
      ) {
        state.fines[studentId] =
          Math.max(
            0,
            state.fines[
              studentId
            ] - amount,
          );
      }

      saveState(state);
    },
  },
});

// =========================
// EXPORTS
// =========================

export const {
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
} = librarySlice.actions;

export default librarySlice.reducer;