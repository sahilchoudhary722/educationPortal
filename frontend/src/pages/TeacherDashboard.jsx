import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SummaryCard from "../components/SummaryCard";

function TeacherDashboard() {
 const users = useSelector((state) => state?.auth?.users ?? []);
  const assignments = useSelector(
    (state) => state?.assignments?.assignments ?? [],
  );
  const attendance = useSelector((state) => state?.attendance?.records ?? []);
  const libraryBooks = useSelector((state) => state?.library?.books ?? []);
  const libraryRequests = useSelector(
    (state) => state?.library?.requests ?? [],
  );
  const { currentUser } = useSelector((state) => state?.auth);

  const students = users.filter((item) => item.role === "student");
  const totalStudents = students.length;
  const activeAssignments = assignments.length;
  const lowAttendanceCount = attendance.filter(
    (item) => item.percentage < 75,
  ).length;
  const issuedBooks = libraryBooks.filter(
    (item) => item.status === "Issued",
  ).length;

  const pendingRequests = libraryRequests.filter(
    (r) => r.status === "Pending",
  ).length;

  const totalPendingAssignments = assignments.reduce((acc, assignment) => {
    const pendingCount = assignment.submissions.filter(
      (item) => item.status === "Pending",
    ).length;
    return acc + pendingCount;
  }, 0);

  const totalSubmittedAssignments = assignments.reduce((acc, assignment) => {
    const submittedCount = assignment.submissions.filter(
      (item) => item.status === "Submitted",
    ).length;
    return acc + submittedCount;
  }, 0);

  return (
    <div style={{ padding: "20px" }}>
      {/* PAGE HEADER */}
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{
            fontSize: "28px",
            margin: "0 0 8px 0",
            fontWeight: "700",
          }}
        >
          👨‍🏫 Teacher Dashboard
        </h1>
        <p style={{ margin: "0", color: "#64748b" }}>
          Welcome back, {currentUser?.name || "Teacher"}! Manage your classes
          and students
        </p>
      </div>

      {/* TEACHER INFO CARD */}
      <div
        className="card"
        style={{
          marginBottom: "24px",
          backgroundColor: "linear-gradient(135deg, #e0f2fe, #f0f9ff)",
          border: "1px solid #7dd3fc",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 4px 0",
                fontSize: "12px",
                color: "#64748b",
                fontWeight: "600",
              }}
            >
              Name
            </p>
            <p style={{ margin: "0", fontSize: "16px", fontWeight: "700" }}>
              {currentUser?.name}
            </p>
          </div>
          <div>
            <p
              style={{
                margin: "0 0 4px 0",
                fontSize: "12px",
                color: "#64748b",
                fontWeight: "600",
              }}
            >
              Email
            </p>
            <p
              style={{
                margin: "0",
                fontSize: "14px",
                fontWeight: "600",
                color: "#0c4a6e",
              }}
            >
              {currentUser?.email}
            </p>
          </div>
          <div>
            <p
              style={{
                margin: "0 0 4px 0",
                fontSize: "12px",
                color: "#64748b",
                fontWeight: "600",
              }}
            >
              Department
            </p>
            <p style={{ margin: "0", fontSize: "16px", fontWeight: "700" }}>
              {currentUser?.department || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* KEY METRICS - 4 CARDS */}
      <div className="grid-4" style={{ marginBottom: "24px" }}>
        <SummaryCard
          title="👥 Total Students"
          value={totalStudents}
          color="#2563eb"
        />
        <SummaryCard
          title="📋 Active Assignments"
          value={activeAssignments}
          color="#16a34a"
        />
        <SummaryCard
          title="⚠️ Low Attendance"
          value={lowAttendanceCount}
          color="#dc2626"
        />
        <SummaryCard
          title="📚 Books Issued"
          value={issuedBooks}
          color="#7c3aed"
        />
      </div>

      {/* IMPORTANT ALERTS */}
      {(pendingRequests > 0 || totalPendingAssignments > 0) && (
        <div
          className="card"
          style={{
            marginBottom: "24px",
            borderLeft: "4px solid #f59e0b",
            backgroundColor: "#fffbeb",
          }}
        >
          <h2
            className="section-title"
            style={{ marginTop: "0", color: "#92400e" }}
          >
            🔔 Pending Actions
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            {pendingRequests > 0 && (
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#fef3c7",
                  borderRadius: "6px",
                  borderLeft: "3px solid #f59e0b",
                }}
              >
                <p
                  style={{
                    margin: "0 0 8px 0",
                    fontWeight: "700",
                    fontSize: "14px",
                  }}
                >
                  📚 {pendingRequests} Book Request
                  {pendingRequests !== 1 ? "s" : ""}
                </p>
                <Link
                  to="/library"
                  className="btn btn-warning"
                  style={{
                    display: "inline-block",
                    fontSize: "12px",
                    padding: "6px 12px",
                    textDecoration: "none",
                    textAlign: "center",
                  }}
                >
                  Review Requests
                </Link>
              </div>
            )}

            {totalPendingAssignments > 0 && (
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#fef3c7",
                  borderRadius: "6px",
                  borderLeft: "3px solid #f59e0b",
                }}
              >
                <p
                  style={{
                    margin: "0 0 8px 0",
                    fontWeight: "700",
                    fontSize: "14px",
                  }}
                >
                  📝 {totalPendingAssignments} Pending Submission
                  {totalPendingAssignments !== 1 ? "s" : ""}
                </p>
                <Link
                  to="/assignments"
                  className="btn btn-warning"
                  style={{
                    display: "inline-block",
                    fontSize: "12px",
                    padding: "6px 12px",
                    textDecoration: "none",
                    textAlign: "center",
                  }}
                >
                  Check Submissions
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ASSIGNMENT SUMMARY */}
      <div className="grid-2" style={{ marginBottom: "24px" }}>
        <div
          className="card"
          style={{
            backgroundColor: "#f0fdf4",
            borderLeft: "4px solid #16a34a",
          }}
        >
          <h2 className="section-title" style={{ marginTop: "0" }}>
            📊 Assignment Status
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "12px",
                  color: "#64748b",
                  fontWeight: "600",
                }}
              >
                ⏳ Pending Submissions
              </p>
              <p
                style={{
                  margin: "0",
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#f59e0b",
                }}
              >
                {totalPendingAssignments}
              </p>
            </div>
            <div>
              <p
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "12px",
                  color: "#64748b",
                  fontWeight: "600",
                }}
              >
                ✅ Submitted
              </p>
              <p
                style={{
                  margin: "0",
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#16a34a",
                }}
              >
                {totalSubmittedAssignments}
              </p>
            </div>
          </div>
        </div>

        <div
          className="card"
          style={{
            backgroundColor: "#f0f9ff",
            borderLeft: "4px solid #2563eb",
          }}
        >
          <h2 className="section-title" style={{ marginTop: "0" }}>
            🎓 Quick Links
          </h2>
          <div style={{ display: "grid", gap: "8px" }}>
            <Link
              to="/students"
              className="btn btn-primary"
              style={{
                display: "block",
                textAlign: "center",
                textDecoration: "none",
                fontSize: "13px",
                padding: "10px",
              }}
            >
              👥 View All Students
            </Link>
            <Link
              to="/assignments"
              className="btn btn-primary"
              style={{
                display: "block",
                textAlign: "center",
                textDecoration: "none",
                fontSize: "13px",
                padding: "10px",
              }}
            >
              📝 Manage Assignments
            </Link>
            <Link
              to="/attendance"
              className="btn btn-primary"
              style={{
                display: "block",
                textAlign: "center",
                textDecoration: "none",
                fontSize: "13px",
                padding: "10px",
              }}
            >
              📅 Manage Attendance
            </Link>
            <Link
              to="/library"
              className="btn btn-primary"
              style={{
                display: "block",
                textAlign: "center",
                textDecoration: "none",
                fontSize: "13px",
                padding: "10px",
              }}
            >
              📚 Manage Library
            </Link>
          </div>
        </div>
      </div>

      {/* STUDENTS OVERVIEW */}
      <div className="card">
        <h2 className="section-title">👥 Students Overview</h2>

        {students.length === 0 ? (
          <div className="empty-state" style={{ margin: "0" }}>
            <p>No students found in the system</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll Number</th>
                  <th>Semester</th>
                  <th>Avg. Attendance</th>
                  <th>Avg. Assignment Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const studentAttendance = attendance.filter(
                    (item) => item.studentId === student.id,
                  );

                  const avgAttendance =
                    studentAttendance.length > 0
                      ? Math.round(
                          studentAttendance.reduce(
                            (acc, item) => acc + item.percentage,
                            0,
                          ) / studentAttendance.length,
                        )
                      : 0;

                  const studentAssignments = assignments.map((assignment) => {
                    const submission = assignment.submissions.find(
                      (sub) => sub.studentId === student.id,
                    );
                    return submission?.status || "Pending";
                  });

                  const submittedCount = studentAssignments.filter(
                    (s) => s === "Submitted",
                  ).length;

                  return (
                    <tr key={student.id}>
                      <td style={{ fontWeight: "600" }}>{student.name}</td>
                      <td>{student.rollNumber || "N/A"}</td>
                      <td>{student.semester || "N/A"}</td>
                      <td>
                        <span
                          className={`badge ${
                            avgAttendance >= 75
                              ? "badge-success"
                              : avgAttendance >= 50
                                ? "badge-warning"
                                : "badge-danger"
                          }`}
                        >
                          {avgAttendance}%
                        </span>
                      </td>
                      <td>
                        {submittedCount}/{studentAssignments.length} submitted
                      </td>
                      <td>
                        <Link
                          to={`/students/${student.id}`}
                          className="btn btn-primary"
                          style={{
                            fontSize: "11px",
                            padding: "6px 10px",
                            textDecoration: "none",
                          }}
                        >
                          View Profile
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherDashboard;
