import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  requestBook,
  addToWishlist,
  removeFromWishlist,
  reserveBook,
  cancelReservation,
} from "../features/library/librarySlice";

import "./LibraryCard.css";

function LibraryCard({
  book,
  currentUser,
  students,
  formState,
  onChange,
  onIssue,
  onReturn,
}) {
  const dispatch = useDispatch();

  const users = useSelector((state) => state.auth.users || []);

  const reservations = useSelector((state) => state.library.reservations || []);

  const wishlists = useSelector((state) => state.library.wishlists || {});

  // ================= ISSUED USER =================

  const issuedStudent = useMemo(() => {
    return users.find((user) => user.id === book.issuedToId);
  }, [users, book.issuedToId]);

  // ================= RESERVATIONS =================

  const reservedCount = reservations.filter(
    (reservation) => reservation.bookId === book.id,
  ).length;

  const reservedByCurrentUser =
    currentUser?.role === "student" &&
    reservations.some(
      (reservation) =>
        reservation.bookId === book.id &&
        reservation.studentId === currentUser.id,
    );

  // ================= WISHLIST =================

  const currentWishlist = wishlists[currentUser?.id] || [];

  const isWishlisted = currentWishlist.includes(book.id);

  // ================= OVERDUE =================

  const isBookOverdue = useMemo(() => {
    if (!book.returnDate || book.status !== "Issued") {
      return false;
    }

    try {
      const [day, month, year] = book.returnDate.split(" ");

      const monthIndex = new Date(`${month} 1`).getMonth();

      const returnDate = new Date(parseInt(year), monthIndex, parseInt(day));

      return returnDate < new Date();
    } catch {
      return false;
    }
  }, [book]);

  // ================= HANDLERS =================

  const handleRequest = () => {
    dispatch(
      requestBook({
        bookId: book.id,
        studentId: currentUser.id,
      }),
    );

    alert("Book Request Sent");
  };

  const handleWishlist = () => {
    if (isWishlisted) {
      dispatch(
        removeFromWishlist({
          studentId: currentUser.id,
          bookId: book.id,
        }),
      );

      alert("Removed From Wishlist");
    } else {
      dispatch(
        addToWishlist({
          studentId: currentUser.id,
          bookId: book.id,
        }),
      );

      alert("Added To Wishlist");
    }
  };

  const handleReserve = () => {
    if (reservedByCurrentUser) {
      dispatch(
        cancelReservation({
          bookId: book.id,
          studentId: currentUser.id,
        }),
      );

      alert("Reservation Cancelled");
    } else {
      dispatch(
        reserveBook({
          bookId: book.id,
          studentId: currentUser.id,
        }),
      );

      alert("Book Reserved");
    }
  };

  // ================= FALLBACK IMAGE =================

  const handleImageError = (e) => {
    e.target.src = "https://placehold.co/300x400?text=Book";
  };

  return (
    <div className="library-card">
      {/* IMAGE */}

      <div className="book-image-container">
        <img
          src={book.image}
          alt={book.title}
          className="book-image"
          onError={(e) => {
            e.target.src = "https://placehold.co/300x400?text=No+Image";
          }}
        />

        <div className="status-badge">
          <span
            className={`badge ${
              book.status === "Available" ? "badge-available" : "badge-issued"
            }`}
          >
            {book.status}
          </span>
        </div>
      </div>

      {/* INFO */}

      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>

        <p className="book-author">{book.author}</p>

        <p className="book-category">{book.category}</p>

        <div className="rating">
          ⭐ {book.rating} ({book.reviews} reviews)
        </div>

        {/* ISSUED INFO */}

        {issuedStudent && (
          <div className="issued-to">
            <p>
              <strong>Issued To:</strong> {issuedStudent.name}
            </p>

            <p>
              <strong>Return Date:</strong> {book.returnDate}
            </p>

            {isBookOverdue && <span className="overdue-tag">OVERDUE</span>}
          </div>
        )}

        {/* RESERVATIONS */}

        {reservedCount > 0 && (
          <p className="reservations">{reservedCount} Reservations</p>
        )}
      </div>

      {/* TEACHER */}

      {currentUser?.role === "teacher" && book.status === "Available" && (
        <div className="teacher-controls">
          <select
            name="studentId"
            value={formState?.studentId || ""}
            onChange={(e) => onChange(book.id, e)}
            className="input"
          >
            <option value="">Select Student</option>

            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="issueDate"
            value={formState?.issueDate || ""}
            onChange={(e) => onChange(book.id, e)}
            className="input"
          />

          <input
            type="date"
            name="returnDate"
            value={formState?.returnDate || ""}
            onChange={(e) => onChange(book.id, e)}
            className="input"
          />

          <button className="btn btn-primary" onClick={() => onIssue(book.id)}>
            Issue Book
          </button>
        </div>
      )}

      {/* RETURN */}

      {currentUser?.role === "teacher" && book.status === "Issued" && (
        <button
          className="btn btn-danger full-width"
          onClick={() => onReturn(book.id)}
        >
          Return Book
        </button>
      )}

      {/* STUDENT */}

      {currentUser?.role === "student" && book.status === "Available" && (
        <div className="student-actions">
          <button
            className="btn btn-primary full-width"
            onClick={handleRequest}
          >
            Request Book
          </button>
        </div>
      )}

      {/* RESERVE + WISHLIST */}

      {currentUser?.role === "student" && (
        <div className="student-actions">
          {book.status === "Issued" && (
            <button
              className={`btn full-width ${
                reservedByCurrentUser ? "btn-warning" : "btn-secondary"
              }`}
              onClick={handleReserve}
            >
              {reservedByCurrentUser ? "Cancel Reservation" : "Reserve Book"}
            </button>
          )}

          <button
            className={`btn full-width ${
              isWishlisted ? "btn-danger" : "btn-outline"
            }`}
            onClick={handleWishlist}
          >
            {isWishlisted ? "Remove Wishlist" : "Add Wishlist"}
          </button>
        </div>
      )}
    </div>
  );
}

export default React.memo(LibraryCard);
