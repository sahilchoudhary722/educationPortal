import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAttendance } from "../features/attendance/attendanceSlice";
import AttendanceCard from "../components/AttendanceCard";

function Attendance() {
  const dispatch = useDispatch();
  const records = useSelector((state) => state?.attendance?.records ?? []);
  const users = useSelector((state) => state.auth.users);
  const { currentUser } = useSelector((state) => state?.auth);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [filterView, setFilterView] = useState("today"); // "today", "all", "low"
  const [filterStudent, setFilterStudent] = useState("");
  const [filterStudentId, setFilterStudentId] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const formatRecordDate = (record) => {
    if (!record?.createdAt) return "";
    return new Date(record.createdAt).toISOString().split("T")[0];
  };

  const getAttendanceStatus = (record) => {
    if (record.percentage >= 75) return "Good";
    if (record.percentage >= 50) return "Warning";
    return "Critical";
  };

  const baseRecords =
    currentUser?.role === "student"
      ? records.filter((record) => record.studentId === currentUser.id)
      : records.map((record) => {
          const student = users.find((user) => user.id === record.studentId);
          return {
            ...record,
            studentName: student?.name || "Unknown Student",
          };
        });

  const filteredRecords = baseRecords.filter((record) => {
    const recordDate = formatRecordDate(record);
    const status = getAttendanceStatus(record);

    if (
      filterStudent &&
      !record.studentName?.toLowerCase().includes(filterStudent.toLowerCase())
    ) {
      return false;
    }

    if (
      filterStudentId &&
      !String(record.studentId).includes(filterStudentId)
    ) {
      return false;
    }

    if (
      filterSubject &&
      !record.subject?.toLowerCase().includes(filterSubject.toLowerCase())
    ) {
      return false;
    }

    if (filterStatus && status !== filterStatus) {
      return false;
    }

    if (filterDate && recordDate !== filterDate) {
      return false;
    }

    return true;
  });

  // Filter based on view
  let displayedRecords = filteredRecords;
  if (filterView === "low") {
    displayedRecords = filteredRecords.filter((r) => r.percentage < 75);
  }

  const [formState, setFormState] = useState(() => {
    const initialValues = {};
    filteredRecords.forEach((record) => {
      initialValues[record.id] = {
        attended: record.attended,
        total: record.total,
      };
    });
    return initialValues;
  });

  const handleChange = (id, e) => {
    const { name, value } = e.target;

    setFormState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [name]: value,
      },
    }));
  };

  const handleUpdate = (id) => {
    const attended = Number(formState[id].attended);
    const total = Number(formState[id].total);

    if (total <= 0 || attended < 0 || attended > total) {
      alert("Please enter valid attendance values.");
      return;
    }

    const percentage = Math.round((attended / total) * 100);

    dispatch(
      updateAttendance({
        id,
        attended,
        total,
        percentage,
      }),
    );

    alert("Attendance updated successfully!");
  };

  const overallAttendance =
    filteredRecords.length > 0
      ? Math.round(
          filteredRecords.reduce((acc, item) => acc + item.percentage, 0) /
            filteredRecords.length,
        )
      : 0;

  const lowAttendanceCount = filteredRecords.filter(
    (r) => r.percentage < 75,
  ).length;

  const attendanceStatus =
    overallAttendance >= 75
      ? "Good"
      : overallAttendance >= 50
        ? "Warning"
        : "Critical";

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
          📅 Attendance Management System
        </h1>
        <p style={{ margin: "0", color: "#64748b" }}>
          Track and manage attendance records
        </p>
      </div>

      {/* OVERALL ATTENDANCE SUMMARY */}
      <div className="grid-3" style={{ marginBottom: "24px" }}>
        <div
          className="card"
          style={{
            backgroundColor:
              overallAttendance >= 75
                ? "#d1fae5"
                : overallAttendance >= 50
                  ? "#fef3c7"
                  : "#fee2e2",
            border:
              overallAttendance >= 75
                ? "1px solid #6ee7b7"
                : overallAttendance >= 50
                  ? "1px solid #fcd34d"
                  : "1px solid #fca5a5",
          }}
        >
          <h3
            style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#64748b" }}
          >
            📊 Overall Attendance
          </h3>
          <p
            style={{
              fontSize: "32px",
              fontWeight: "700",
              margin: "0",
              color:
                overallAttendance >= 75
                  ? "#166534"
                  : overallAttendance >= 50
                    ? "#92400e"
                    : "#b91c1c",
            }}
          >
            {overallAttendance}%
          </p>
          <p
            style={{
              fontSize: "12px",
              margin: "8px 0 0 0",
              color:
                overallAttendance >= 75
                  ? "#047857"
                  : overallAttendance >= 50
                    ? "#b45309"
                    : "#991b1b",
              fontWeight: "600",
            }}
          >
            Status: <strong>{attendanceStatus}</strong>
          </p>
        </div>

        <div className="card">
          <h3
            style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#64748b" }}
          >
            📚 Total Classes
          </h3>
          <p
            style={{
              fontSize: "32px",
              fontWeight: "700",
              margin: "0",
              color: "#2563eb",
            }}
          >
            {filteredRecords.length}
          </p>
          <p
            style={{ fontSize: "12px", margin: "8px 0 0 0", color: "#64748b" }}
          >
            Subjects being tracked
          </p>
        </div>

        {currentUser?.role === "teacher" && (
          <div className="card">
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: "14px",
                color: "#64748b",
              }}
            >
              ⚠️ Low Attendance
            </h3>
            <p
              style={{
                fontSize: "32px",
                fontWeight: "700",
                margin: "0",
                color: "#dc2626",
              }}
            >
              {lowAttendanceCount}
            </p>
            <p
              style={{
                fontSize: "12px",
                margin: "8px 0 0 0",
                color: "#64748b",
              }}
            >
              Below 75% threshold
            </p>
          </div>
        )}
      </div>

      {/* FILTERS AND DATE SELECTOR */}
      <div className="card" style={{ marginBottom: "24px", padding: "16px" }}>
        <h2 className="section-title" style={{ marginTop: "0" }}>
          🔍 Filters & Options
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
          }}
        >
          {currentUser?.role === "teacher" && (
            <div>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#475569",
                }}
              >
                Student Name
              </label>
              <input
                type="text"
                className="input"
                placeholder="Search student"
                value={filterStudent}
                onChange={(e) => setFilterStudent(e.target.value)}
                style={{ marginTop: "6px" }}
              />
            </div>
          )}

          {currentUser?.role === "teacher" && (
            <div>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#475569",
                }}
              >
                Student ID
              </label>
              <input
                type="text"
                className="input"
                placeholder="Search student ID"
                value={filterStudentId}
                onChange={(e) => setFilterStudentId(e.target.value)}
                style={{ marginTop: "6px" }}
              />
            </div>
          )}

          <div>
            <label
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#475569",
              }}
            >
              Subject
            </label>
            <input
              type="text"
              className="input"
              placeholder="Enter subject"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              style={{ marginTop: "6px" }}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#475569",
              }}
            >
              Status
            </label>
            <select
              className="input"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ marginTop: "6px" }}
            >
              <option value="">All Status</option>
              <option value="Good">Good</option>
              <option value="Warning">Warning</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div>
            <label
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#475569",
              }}
            >
              Date
            </label>
            <input
              type="date"
              className="input"
              value={filterDate || selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setFilterDate(e.target.value);
              }}
              style={{ marginTop: "6px" }}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#475569",
              }}
            >
              View
            </label>
            <select
              className="input"
              value={filterView}
              onChange={(e) => setFilterView(e.target.value)}
              style={{ marginTop: "6px" }}
            >
              <option value="all">All Subjects</option>
              <option value="low">Low Attendance (&lt;75%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ATTENDANCE CARDS */}
      {displayedRecords.length > 0 ? (
        <>
          <div style={{ marginBottom: "16px" }}>
            <p style={{ margin: "0", color: "#64748b", fontSize: "14px" }}>
              Showing <strong>{displayedRecords.length}</strong> record
              {displayedRecords.length !== 1 ? "s" : ""}
              {filterView === "low" && " (Below 75%)"}
            </p>
          </div>

          <div className="grid-2">
            {displayedRecords.map((record) => (
              <AttendanceCard
                key={record.id}
                record={record}
                currentUser={currentUser}
                editedValues={formState[record.id]}
                onChange={handleChange}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <p style={{ fontSize: "16px", fontWeight: "600", margin: "0" }}>
            📭 No attendance records found
          </p>
          <p style={{ margin: "8px 0 0 0", color: "#64748b" }}>
            {filterView === "low"
              ? "All students have good attendance!"
              : "No records to display"}
          </p>
        </div>
      )}

      {/* STUDENT WARNING */}
      {currentUser?.role === "student" && overallAttendance < 75 && (
        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            backgroundColor: "#fee2e2",
            border: "1px solid #fca5a5",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: "0",
              fontSize: "16px",
              fontWeight: "700",
              color: "#b91c1c",
            }}
          >
            ⚠️ Your overall attendance is below the required 75%!
          </p>
          <p
            style={{
              margin: "8px 0 0 0",
              fontSize: "14px",
              color: "#991b1b",
            }}
          >
            Please contact your instructor to improve your attendance.
          </p>
        </div>
      )}
    </div>
  );
}

export default Attendance;
