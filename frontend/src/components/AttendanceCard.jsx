function AttendanceCard({
  record,
  currentUser,
  editedValues,
  onChange,
  onUpdate,
}) {
  const isLowAttendance = record.percentage < 75;
  const isVeryLowAttendance = record.percentage < 50;

  // Get attendance status color
  const getStatusColor = () => {
    if (record.percentage >= 75) return "#16a34a";
    if (record.percentage >= 50) return "#f59e0b";
    return "#dc2626";
  };

  const getStatusLabel = () => {
    if (record.percentage >= 75) return "✅ Good";
    if (record.percentage >= 50) return "⚠️ Warning";
    return "🔴 Critical";
  };

  return (
    <div
      className="card"
      style={{
        border: isVeryLowAttendance
          ? "2px solid #dc2626"
          : isLowAttendance
            ? "1px solid #f59e0b"
            : "1px solid #16a34a",
        borderRadius: "8px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <div>
          <h3
            style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "700" }}
          >
            📖 {record.subject}
          </h3>
          {record.studentName && currentUser?.role === "teacher" && (
            <p style={{ margin: "0", fontSize: "13px", color: "#64748b" }}>
              👤 {record.studentName}
            </p>
          )}
        </div>
        <div
          style={{
            padding: "6px 12px",
            borderRadius: "20px",
            backgroundColor:
              record.percentage >= 75
                ? "#dcfce7"
                : record.percentage >= 50
                  ? "#fef3c7"
                  : "#fee2e2",
            color: getStatusColor(),
            fontWeight: "700",
            fontSize: "12px",
            minWidth: "80px",
            textAlign: "center",
          }}
        >
          {record.percentage}%
        </div>
      </div>

      {/* ATTENDANCE DETAILS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          marginBottom: "16px",
          padding: "12px",
          backgroundColor: "#f8fafc",
          borderRadius: "6px",
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
            📊 Classes Attended
          </p>
          <p
            style={{
              margin: "0",
              fontSize: "18px",
              fontWeight: "700",
              color: "#2563eb",
            }}
          >
            {record.attended}
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
            📅 Total Classes
          </p>
          <p
            style={{
              margin: "0",
              fontSize: "18px",
              fontWeight: "700",
              color: "#7c3aed",
            }}
          >
            {record.total}
          </p>
        </div>
      </div>

      {/* STATUS */}
      <div
        style={{ marginBottom: "14px", fontSize: "13px", fontWeight: "600" }}
      >
        Status:{" "}
        <span style={{ color: getStatusColor() }}>{getStatusLabel()}</span>
      </div>

      {/* LOW ATTENDANCE WARNING */}
      {isLowAttendance && currentUser?.role === "student" && (
        <div
          style={{
            padding: "10px",
            backgroundColor: isVeryLowAttendance ? "#fee2e2" : "#fef3c7",
            border: isVeryLowAttendance
              ? "1px solid #fca5a5"
              : "1px solid #fcd34d",
            borderRadius: "4px",
            color: isVeryLowAttendance ? "#b91c1c" : "#92400e",
            fontSize: "12px",
            fontWeight: "600",
            marginBottom: "14px",
          }}
        >
          {isVeryLowAttendance
            ? "🔴 Critical: Your attendance is dangerously low!"
            : "⚠️ Warning: Your attendance is below 75%"}
        </div>
      )}

      {/* TEACHER - UPDATE FORM */}
      {currentUser?.role === "teacher" && (
        <div className="form-grid" style={{ gap: "8px" }}>
          <div>
            <label
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#475569",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Classes Attended
            </label>
            <input
              className="input"
              type="number"
              name="attended"
              placeholder="Attended"
              value={editedValues?.attended ?? ""}
              onChange={(e) => onChange(record.id, e)}
              style={{ padding: "8px", fontSize: "13px" }}
              min="0"
            />
          </div>

          <div>
            <label
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#475569",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Total Classes
            </label>
            <input
              className="input"
              type="number"
              name="total"
              placeholder="Total"
              value={editedValues?.total ?? ""}
              onChange={(e) => onChange(record.id, e)}
              style={{ padding: "8px", fontSize: "13px" }}
              min="0"
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={() => onUpdate(record.id)}
            style={{
              padding: "10px 12px",
              fontSize: "13px",
              fontWeight: "600",
              width: "100%",
              marginTop: "4px",
            }}
          >
            ✅ Update Attendance
          </button>
        </div>
      )}
    </div>
  );
}

export default AttendanceCard;
