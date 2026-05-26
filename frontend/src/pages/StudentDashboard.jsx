import { useSelector } from "react-redux";
import SummaryCard from "../components/SummaryCard";

function StudentDashboard() {
  const assignments = useSelector((state) => state.assignments.assignments);
  const attendance = useSelector((state) => state.attendance.records);
  const libraryBooks = useSelector((state) => state.library.books);
  const cartItems = useSelector((state) => state.cart.items);
  const { currentUser } = useSelector((state) => state.auth);

  const studentAssignments = assignments.map((assignment) => {
    const submission = assignment.submissions.find(
      (item) => item.studentId === currentUser?.id,
    );

    return {
      ...assignment,
      status: submission?.status || "Pending",
      submittedAt: submission?.submittedAt || "",
      submittedFileName: submission?.submittedFileName || "",
    };
  });

  const pendingAssignments = studentAssignments.filter(
    (item) => item.status === "Pending",
  ).length;

  const submittedAssignments = studentAssignments.filter(
    (item) => item.status === "Submitted",
  ).length;

  const studentAttendance = attendance.filter(
    (item) => item.studentId === currentUser?.id,
  );

  const overallAttendance =
    studentAttendance.length > 0
      ? studentAttendance.reduce((acc, item) => acc + item.percentage, 0) /
        studentAttendance.length
      : 0;

  const issuedBooks = libraryBooks.filter(
    (item) => item.issuedToId === currentUser?.id,
  ).length;

  const lowAttendanceSubjects = studentAttendance.filter(
    (item) => item.percentage < 75,
  );

  return (
    <div>
      <h1 className="page-title">Student Dashboard</h1>

      <div className="grid-4">
        <SummaryCard
          title="Pending Assignments"
          value={pendingAssignments}
          color="#f59e0b"
        />
        <SummaryCard
          title="Submitted Assignments"
          value={submittedAssignments}
          color="#16a34a"
        />
        <SummaryCard
          title="Attendance"
          value={`${overallAttendance.toFixed(0)}%`}
          color="#2563eb"
        />
        <SummaryCard title="Issued Books" value={issuedBooks} color="#7c3aed" />
      </div>

      <div className="grid-2" style={{ marginTop: "20px" }}>
        <div className="card">
          <h2 className="section-title">Student Details</h2>
          <p style={{ marginBottom: "8px" }}>
            <strong>Name:</strong> {currentUser?.name}
          </p>
          <p style={{ marginBottom: "8px" }}>
            <strong>Email:</strong> {currentUser?.email}
          </p>
          <p style={{ marginBottom: "8px" }}>
            <strong>Course:</strong> {currentUser?.course}
          </p>
          <p style={{ marginBottom: "8px" }}>
            <strong>Semester:</strong> {currentUser?.semester}
          </p>
          <p>
            <strong>Roll Number:</strong> {currentUser?.rollNumber}
          </p>
        </div>

        <div className="card">
          <h2 className="section-title">Quick Overview</h2>
          <p style={{ marginBottom: "8px" }}>
            Items in Cart: {cartItems.length}
          </p>
          <p style={{ marginBottom: "8px" }}>
            Low Attendance Subjects: {lowAttendanceSubjects.length}
          </p>
          <p>Upcoming Academic Tasks: {pendingAssignments}</p>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: "20px" }}>
        <div className="card">
          <h2 className="section-title">My Assignments</h2>

          {studentAssignments.length === 0 ? (
            <p>No assignments available.</p>
          ) : (
            studentAssignments.map((assignment) => (
              <div
                key={assignment.id}
                style={{
                  padding: "12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  marginBottom: "12px",
                }}
              >
                <p style={{ marginBottom: "6px" }}>
                  <strong>Title:</strong> {assignment.title}
                </p>
                <p style={{ marginBottom: "6px" }}>
                  <strong>Subject:</strong> {assignment.subject}
                </p>
                <p style={{ marginBottom: "6px" }}>
                  <strong>Due Date:</strong> {assignment.dueDate}
                </p>
                <p style={{ marginBottom: "6px" }}>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`status-badge ${
                      assignment.status === "Submitted"
                        ? "status-submitted"
                        : "status-pending"
                    }`}
                  >
                    {assignment.status}
                  </span>
                </p>
                <p>
                  <strong>Submitted At:</strong>{" "}
                  <span
                    style={{
                      color: assignment.submittedAt ? "#16a34a" : "#dc2626",
                      fontWeight: "600",
                    }}
                  >
                    {assignment.submittedAt
                      ? assignment.submittedAt
                      : "Not Submitted"}
                    {assignment.assignmentFileName?.trim() && (
                      <p style={{ marginTop: "6px" }}>
                        <strong>Submitted File:</strong>{" "}
                        <span className="file-badge success-file">
                          {assignment.submittedFileName}
                        </span>
                      </p>
                    )}
                  </span>
                </p>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <h2 className="section-title">My Attendance</h2>

          {studentAttendance.length === 0 ? (
            <p>No attendance records available.</p>
          ) : (
            studentAttendance.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  marginBottom: "12px",
                }}
              >
                <p style={{ marginBottom: "6px" }}>
                  <strong>Subject:</strong> {item.subject}
                </p>
                <p style={{ marginBottom: "6px" }}>
                  <strong>Attended:</strong> {item.attended}
                </p>
                <p style={{ marginBottom: "6px" }}>
                  <strong>Total Classes:</strong> {item.total}
                </p>
                <p>
                  <strong>Percentage:</strong> {item.percentage}%
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
