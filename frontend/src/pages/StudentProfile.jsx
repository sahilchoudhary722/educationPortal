import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";

function StudentProfile() {
  const { studentId } = useParams();
  const users = useSelector((state) => state?.auth?.users ?? []);
  const assignments = useSelector(
    (state) => state?.assignments?.assignments ?? [],
  );
  const attendance = useSelector((state) => state?.attendance?.records ?? []);
  const books = useSelector((state) => state?.library?.books ?? []);

  const student = users.find((user) => user.id === Number(studentId));

  const parseDate = (dateString) => {
    const parsedDate = new Date(dateString);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  const getCountdownText = (dueDate) => {
    const due = parseDate(dueDate);
    if (!due) return "Invalid date";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1) return `${diffDays} days left`;
    if (diffDays === 1) return "1 day left";
    if (diffDays === 0) return "Due today";
    if (diffDays === -1) return "1 day overdue";
    return `${Math.abs(diffDays)} days overdue`;
  };

  const getCountdownClass = (dueDate, status) => {
    if (status === "Submitted") return "countdown-submitted";
    const due = parseDate(dueDate);
    if (!due) return "countdown-overdue";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "countdown-overdue";
    if (diffDays <= 2) return "countdown-urgent";
    return "countdown-normal";
  };

  const studentAssignments = useMemo(() => {
    return assignments.map((assignment) => {
      const submission = assignment.submissions.find(
        (item) => item.studentId === Number(studentId),
      );

      return {
        ...assignment,
        status: submission?.status || "Pending",
        submittedAt: submission?.submittedAt || "",
        submittedFileName: submission?.submittedFileName || "",
      };
    });
  }, [assignments, studentId]);

  const studentAttendance = attendance.filter(
    (item) => item.studentId === Number(studentId),
  );

  const studentBooks = books.filter(
    (item) => item.issuedToId === Number(studentId),
  );

  const overallAttendance =
    studentAttendance.length > 0
      ? Math.round(
          studentAttendance.reduce((acc, item) => acc + item.percentage, 0) /
            studentAttendance.length,
        )
      : 0;

  const submittedAssignments = studentAssignments.filter(
    (a) => a.status === "Submitted",
  ).length;

  const pendingAssignments = studentAssignments.filter(
    (a) => a.status === "Pending",
  ).length;

  if (!student) {
    return (
      <div style={{ padding: "20px" }}>
        <div className="empty-state">
          <p style={{ fontSize: "18px", fontWeight: "700" }}>
            ❌ Student Not Found
          </p>
          <p style={{ color: "#64748b", marginTop: "8px" }}>
            The student you're looking for doesn't exist
          </p>
          <Link
            to="/students"
            className="btn btn-primary"
            style={{ marginTop: "16px" }}
          >
            ← Back to Students
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      {/* HEADER */}
      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1
            style={{ fontSize: "28px", margin: "0 0 4px 0", fontWeight: "700" }}
          >
            👤 {student.name}'s Profile
          </h1>
          <p style={{ margin: "0", color: "#64748b" }}>
            Complete student information
          </p>
        </div>
        <Link
          to="/students"
          className="btn btn-outline"
          style={{
            textDecoration: "none",
            fontSize: "13px",
            padding: "8px 14px",
          }}
        >
          ← Back to Students
        </Link>
      </div>

      {/* STUDENT BASIC INFO */}
      <div
        className="card"
        style={{
          marginBottom: "24px",
          background: "linear-gradient(135deg, #e0f2fe, #f0f9ff)",
          borderLeft: "4px solid #2563eb",
        }}
      >
        <h2 className="section-title" style={{ marginTop: "0" }}>
          📋 Basic Information
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 4px 0",
                fontSize: "12px",
                fontWeight: "600",
                color: "#64748b",
              }}
            >
              Name
            </p>
            <p style={{ margin: "0", fontSize: "16px", fontWeight: "700" }}>
              {student.name}
            </p>
          </div>
          <div>
            <p
              style={{
                margin: "0 0 4px 0",
                fontSize: "12px",
                fontWeight: "600",
                color: "#64748b",
              }}
            >
              Email
            </p>
            <p style={{ margin: "0", fontSize: "14px", color: "#0c4a6e" }}>
              {student.email}
            </p>
          </div>
          <div>
            <p
              style={{
                margin: "0 0 4px 0",
                fontSize: "12px",
                fontWeight: "600",
                color: "#64748b",
              }}
            >
              Roll Number
            </p>
            <p style={{ margin: "0", fontSize: "16px", fontWeight: "700" }}>
              {student.rollNumber || "N/A"}
            </p>
          </div>
          <div>
            <p
              style={{
                margin: "0 0 4px 0",
                fontSize: "12px",
                fontWeight: "600",
                color: "#64748b",
              }}
            >
              Course
            </p>
            <p style={{ margin: "0", fontSize: "16px", fontWeight: "700" }}>
              {student.course || "N/A"}
            </p>
          </div>
          <div>
            <p
              style={{
                margin: "0 0 4px 0",
                fontSize: "12px",
                fontWeight: "600",
                color: "#64748b",
              }}
            >
              Semester
            </p>
            <p style={{ margin: "0", fontSize: "16px", fontWeight: "700" }}>
              {student.semester || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* KEY METRICS */}
      <div className="grid-4" style={{ marginBottom: "24px" }}>
        <div
          className="card"
          style={{
            backgroundColor: "#f0fdf4",
            borderLeft: "4px solid #16a34a",
          }}
        >
          <p
            style={{
              margin: "0 0 8px 0",
              fontSize: "12px",
              fontWeight: "600",
              color: "#64748b",
            }}
          >
            📊 Avg Attendance
          </p>
          <p
            style={{
              margin: "0",
              fontSize: "28px",
              fontWeight: "700",
              color:
                overallAttendance >= 75
                  ? "#16a34a"
                  : overallAttendance >= 50
                    ? "#f59e0b"
                    : "#dc2626",
            }}
          >
            {overallAttendance}%
          </p>
        </div>

        <div
          className="card"
          style={{
            backgroundColor: "#f0f9ff",
            borderLeft: "4px solid #2563eb",
          }}
        >
          <p
            style={{
              margin: "0 0 8px 0",
              fontSize: "12px",
              fontWeight: "600",
              color: "#64748b",
            }}
          >
            📝 Total Assignments
          </p>
          <p
            style={{
              margin: "0",
              fontSize: "28px",
              fontWeight: "700",
              color: "#2563eb",
            }}
          >
            {studentAssignments.length}
          </p>
        </div>

        <div
          className="card"
          style={{
            backgroundColor: "#dcfce7",
            borderLeft: "4px solid #16a34a",
          }}
        >
          <p
            style={{
              margin: "0 0 8px 0",
              fontSize: "12px",
              fontWeight: "600",
              color: "#64748b",
            }}
          >
            ✅ Submitted
          </p>
          <p
            style={{
              margin: "0",
              fontSize: "28px",
              fontWeight: "700",
              color: "#16a34a",
            }}
          >
            {submittedAssignments}
          </p>
        </div>

        <div
          className="card"
          style={{
            backgroundColor: "#fef3c7",
            borderLeft: "4px solid #f59e0b",
          }}
        >
          <p
            style={{
              margin: "0 0 8px 0",
              fontSize: "12px",
              fontWeight: "600",
              color: "#64748b",
            }}
          >
            ⏳ Pending
          </p>
          <p
            style={{
              margin: "0",
              fontSize: "28px",
              fontWeight: "700",
              color: "#f59e0b",
            }}
          >
            {pendingAssignments}
          </p>
        </div>
      </div>

      {/* ATTENDANCE SECTION */}
      <div style={{ marginBottom: "24px" }}>
        <div className="card">
          <h2 className="section-title" style={{ marginBottom: "16px" }}>
            📅 Attendance Records
          </h2>

          {studentAttendance.length === 0 ? (
            <div className="empty-state" style={{ margin: "0" }}>
              No attendance records found
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Attended</th>
                    <th>Total</th>
                    <th>Percentage</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentAttendance.map((record) => (
                    <tr key={record.id}>
                      <td>
                        <strong>{record.subject}</strong>
                      </td>
                      <td>{record.attended}</td>
                      <td>{record.total}</td>
                      <td>
                        <strong>{record.percentage}%</strong>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            record.percentage >= 75
                              ? "badge-success"
                              : record.percentage >= 50
                                ? "badge-warning"
                                : "badge-danger"
                          }`}
                        >
                          {record.percentage >= 75
                            ? "Good"
                            : record.percentage >= 50
                              ? "Warning"
                              : "Critical"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ASSIGNMENTS SECTION */}
      <div style={{ marginBottom: "24px" }}>
        <div className="card">
          <h2 className="section-title" style={{ marginBottom: "16px" }}>
            📝 Assignments
          </h2>

          {studentAssignments.length === 0 ? (
            <div className="empty-state" style={{ margin: "0" }}>
              No assignments assigned yet
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Subject</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Submitted On</th>
                  </tr>
                </thead>
                <tbody>
                  {studentAssignments.map((assignment) => (
                    <tr key={assignment.id}>
                      <td>
                        <strong>{assignment.title}</strong>
                      </td>
                      <td>{assignment.subject}</td>
                      <td>{assignment.dueDate}</td>
                      <td>
                        <span
                          className={`badge ${
                            assignment.status === "Submitted"
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {assignment.status}
                        </span>
                      </td>
                      <td>
                        {assignment.status === "Submitted" ? (
                          <span style={{ color: "#16a34a", fontWeight: "600" }}>
                            {assignment.submittedAt}
                          </span>
                        ) : (
                          <span
                            style={{
                              color:
                                getCountdownClass(
                                  assignment.dueDate,
                                  assignment.status,
                                ) === "countdown-overdue"
                                  ? "#dc2626"
                                  : getCountdownClass(
                                        assignment.dueDate,
                                        assignment.status,
                                      ) === "countdown-urgent"
                                    ? "#f59e0b"
                                    : "#64748b",
                              fontWeight: "600",
                            }}
                          >
                            {getCountdownText(assignment.dueDate)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* LIBRARY SECTION */}
      <div>
        <div className="card">
          <h2 className="section-title" style={{ marginBottom: "16px" }}>
            📚 Issued Books
          </h2>

          {studentBooks.length === 0 ? (
            <div className="empty-state" style={{ margin: "0" }}>
              No books currently issued
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Book Title</th>
                    <th>Author</th>
                    <th>Issue Date</th>
                    <th>Return Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentBooks.map((book) => (
                    <tr key={book.id}>
                      <td>
                        <strong>{book.title}</strong>
                      </td>
                      <td>{book.author}</td>
                      <td>{book.issueDate}</td>
                      <td>{book.returnDate}</td>
                      <td>
                        <span className="badge badge-warning">
                          {book.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
