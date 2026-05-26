import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  approveRequest,
  rejectRequest,
} from "../features/library/librarySlice";
import "./RequestList.css";

function RequestList() {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.library.requests ?? []);
  const users = useSelector((state) => state.auth.users ?? []);
  const books = useSelector((state) => state.library.books ?? []);

  const getStudentName = (studentId) => {
    return users.find((u) => u.id === studentId)?.name || "Unknown";
  };

  const getBookTitle = (bookId) => {
    return books.find((b) => b.id === bookId)?.title || "Unknown";
  };

  const handleApprove = (bookId, studentId) => {
    dispatch(
      approveRequest({
        bookId,
        studentId,
        issueDate: "",
        returnDate: "",
      }),
    );
  };

  const handleReject = (bookId, studentId) => {
    dispatch(
      rejectRequest({
        bookId,
        studentId,
        reason: "Request rejected by teacher",
      }),
    );
  };

  if (requests.length === 0) {
    return (
      <div className="request-list-container">
        <h3>📋 Book Requests</h3>
        <p className="no-requests">No pending requests</p>
      </div>
    );
  }

  return (
    <div className="request-list-container">
      <h3>📋 Book Requests ({requests.length})</h3>
      <div className="requests-table">
        {requests.map((request) => (
          <div
            key={`${request.bookId}-${request.studentId}`}
            className="request-item"
          >
            <div className="request-info">
              <p className="request-student">
                <strong>{getStudentName(request.studentId)}</strong>
              </p>
              <p className="request-book">{getBookTitle(request.bookId)}</p>
              <p className="request-date">Requested: {request.requestedDate}</p>
            </div>
            <div className="request-actions">
              <button
                onClick={() => handleApprove(request.bookId, request.studentId)}
                className="btn btn-approve"
              >
                ✓ Approve
              </button>
              <button
                onClick={() => handleReject(request.bookId, request.studentId)}
                className="btn btn-reject"
              >
                ✕ Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RequestList;
