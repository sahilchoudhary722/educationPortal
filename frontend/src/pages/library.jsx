import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  returnBook,
  approveRequest,
  payFine,
} from "../features/library/librarySlice";

import LibraryCard from "../components/LibraryCard";
import RequestList from "../components/RequestList";

import "./library.css";

function Library() {
  const dispatch = useDispatch();

  // ================= REDUX STATE =================

  const books = useSelector((state) => state?.library?.books ?? []);

  const users = useSelector((state) => state?.auth?.users ?? []);

  const currentUser = useSelector((state) => state?.auth?.currentUser ?? null);

  const fines = useSelector((state) => state?.library?.fines ?? {});

  // ================= STUDENTS =================

  const students = useMemo(() => {
    return users.filter((user) => user.role === "student");
  }, [users]);

  // ================= LOCAL STATES =================

  const [formState, setFormState] = useState({});

  const [searchTerm, setSearchTerm] = useState("");

  const [filterCategory, setFilterCategory] = useState("All");

  const [filterStatus, setFilterStatus] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;

  // ================= INIT FORM =================

  useEffect(() => {
    if (books.length > 0) {
      const forms = {};

      books.forEach((book) => {
        forms[book.id] = {
          studentId: "",
          issueDate: "",
          returnDate: "",
        };
      });

      setFormState(forms);
    }
  }, [books]);

  // ================= CATEGORIES =================

  const categories = useMemo(() => {
    return ["All", ...new Set(books.map((book) => book.category))];
  }, [books]);

  // ================= HANDLE CHANGE =================

  const handleChange = (bookId, e) => {
    const { name, value } = e.target;

    setFormState((prev) => ({
      ...prev,

      [bookId]: {
        ...prev[bookId],

        [name]: value,
      },
    }));
  };

  // ================= DATE FORMAT =================

  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    const [year, month, day] = dateStr.split("-").map(Number);

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

    return `${day} ${months[month - 1]} ${year}`;
  };

  // ================= ISSUE BOOK =================

  const handleIssue = (bookId) => {
    const data = formState[bookId];

    if (!data?.studentId || !data?.issueDate || !data?.returnDate) {
      alert("Please fill all fields");

      return;
    }

    dispatch(
      approveRequest({
        bookId,

        studentId: Number(data.studentId),

        issueDate: formatDate(data.issueDate),

        returnDate: formatDate(data.returnDate),
      }),
    );

    alert("Book Issued Successfully");

    setFormState((prev) => ({
      ...prev,

      [bookId]: {
        studentId: "",
        issueDate: "",
        returnDate: "",
      },
    }));
  };

  // ================= RETURN BOOK =================

  const handleReturn = (bookId) => {
    const confirmReturn = window.confirm(
      "Are you sure you want to return this book?",
    );

    if (!confirmReturn) return;

    dispatch(returnBook({ bookId }));

    alert("Book Returned Successfully");
  };

  // ================= FILTER BOOKS =================

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        filterCategory === "All" || book.category === filterCategory;

      const matchesStatus =
        filterStatus === "All" || book.status === filterStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [books, searchTerm, filterCategory, filterStatus]);

  // ================= PAGINATION =================

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,

    currentPage * itemsPerPage,
  );

  // ================= CURRENT USER FINE =================

  const currentUserFine = fines[currentUser?.id] ?? 0;

  // ================= UI =================

  return (
    <div className="library-page">
      <div className="library-header">
        <h1>📚 Library Management System</h1>

        {currentUser?.role === "student" && currentUserFine > 0 && (
          <div className="fine-notice">
            <p>
              Outstanding Fine: ₹<strong>{currentUserFine}</strong>
            </p>

            <button
              className="btn-pay-fine"
              onClick={() =>
                dispatch(
                  payFine({
                    studentId: currentUser.id,

                    amount: currentUserFine,
                  }),
                )
              }
            >
              Pay Fine
            </button>
          </div>
        )}
      </div>

      <div className="library-stats">
        <div className="stat-card">
          <h3>{books.length}</h3>
          <p>Total Books</p>
        </div>

        <div className="stat-card">
          <h3>{books.filter((book) => book.status === "Available").length}</h3>
          <p>Available</p>
        </div>

        <div className="stat-card">
          <h3>{books.filter((book) => book.status === "Issued").length}</h3>
          <p>Issued</p>
        </div>
      </div>

      <div className="library-filters">
        <input
          type="text"
          placeholder="Search by title, author, category..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);

            setCurrentPage(1);
          }}
          className="search-input"
        />

        <select
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);

            setCurrentPage(1);
          }}
          className="filter-select"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);

            setCurrentPage(1);
          }}
          className="filter-select"
        >
          <option value="All">All Status</option>

          <option value="Available">Available</option>

          <option value="Issued">Issued</option>
        </select>
      </div>

      <div className="books-grid">
        {paginatedBooks.length > 0 ? (
          paginatedBooks.map((book) => (
            <LibraryCard
              key={book.id}
              book={book}
              currentUser={currentUser}
              students={students}
              formState={formState[book.id]}
              onChange={handleChange}
              onIssue={handleIssue}
              onReturn={handleReturn}
            />
          ))
        ) : (
          <div className="no-books">No books found</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </button>

          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
          >
            Next
          </button>
        </div>
      )}

      {currentUser?.role === "teacher" && <RequestList />}
    </div>
  );
}

export default library;
