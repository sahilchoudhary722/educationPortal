import { useState } from "react";

function AssignmentCard({ assignment, currentUser, onSubmit }) {
  const [selectedFile, setSelectedFile] = useState(null);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file || null);
  };

  const renderFileActions = (fileUrl, fileName) => {
    if (!fileUrl || !fileName) return null;
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginTop: "8px",
          flexWrap: "wrap",
        }}
      >
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
          style={{ fontSize: "12px", padding: "8px 12px" }}
        >
          View
        </a>
        <a
          href={fileUrl}
          download={fileName}
          className="btn btn-secondary"
          style={{ fontSize: "12px", padding: "8px 12px" }}
        >
          Download
        </a>
      </div>
    );
  };

  // STUDENT VIEW
  if (currentUser?.role === "student") {
    return (
      <div
        className="card"
        style={{
          borderLeft: `4px solid ${
            assignment.status === "Submitted" ? "#16a34a" : "#f59e0b"
          }`,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* HEADER */}
        <div style={{ marginBottom: "12px" }}>
          <h3
            style={{
              margin: "0 0 4px 0",
              fontSize: "16px",
              fontWeight: "700",
            }}
          >
            {assignment.title}
          </h3>
          <p
            style={{
              margin: "0 0 8px 0",
              fontSize: "12px",
              color: "#64748b",
            }}
          >
            {assignment.subject}
          </p>
        </div>

        {/* ASSIGNED BY */}
        <p
          style={{
            margin: "0 0 12px 0",
            fontSize: "13px",
            color: "#475569",
          }}
        >
          <strong>Assigned by:</strong> {assignment.assignedBy}
        </p>

        {/* DUE DATE & STATUS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            marginBottom: "12px",
            padding: "10px",
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
              📅 Due Date
            </p>
            <p style={{ margin: "0", fontSize: "13px", fontWeight: "700" }}>
              {assignment.dueDate}
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
              Status
            </p>
            <span
              className={`badge ${
                assignment.status === "Submitted"
                  ? "badge-success"
                  : "badge-warning"
              }`}
              style={{ fontSize: "12px" }}
            >
              {assignment.status}
            </span>
          </div>
        </div>

        {/* COUNTDOWN */}
        <div
          style={{
            padding: "8px",
            backgroundColor:
              assignment.status === "Submitted"
                ? "#dcfce7"
                : getCountdownClass(assignment.dueDate, assignment.status) ===
                    "countdown-overdue"
                  ? "#fee2e2"
                  : getCountdownClass(assignment.dueDate, assignment.status) ===
                      "countdown-urgent"
                    ? "#fef3c7"
                    : "#e0f2fe",
            border:
              assignment.status === "Submitted"
                ? "1px solid #86efac"
                : getCountdownClass(assignment.dueDate, assignment.status) ===
                    "countdown-overdue"
                  ? "1px solid #fca5a5"
                  : getCountdownClass(assignment.dueDate, assignment.status) ===
                      "countdown-urgent"
                    ? "1px solid #fcd34d"
                    : "1px solid #7dd3fc",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "600",
            color:
              assignment.status === "Submitted"
                ? "#166534"
                : getCountdownClass(assignment.dueDate, assignment.status) ===
                    "countdown-overdue"
                  ? "#b91c1c"
                  : getCountdownClass(assignment.dueDate, assignment.status) ===
                      "countdown-urgent"
                    ? "#92400e"
                    : "#0c4a6e",
            marginBottom: "12px",
          }}
        >
          {assignment.status === "Submitted"
            ? "✅ Completed"
            : getCountdownText(assignment.dueDate)}
        </div>

        {/* ASSIGNMENT FILE (if teacher provided) */}
        {assignment.assignmentFileName?.trim() && (
          <div
            style={{
              padding: "8px",
              backgroundColor: "#f0f9ff",
              borderRadius: "4px",
              marginBottom: "12px",
              fontSize: "12px",
            }}
          >
            <p
              style={{
                margin: "0 0 4px 0",
                fontWeight: "600",
                color: "#0c4a6e",
              }}
            >
              📎 Assignment File:
            </p>
            <p
              style={{
                margin: "0",
                color: "#0369a1",
                wordBreak: "break-all",
              }}
            >
              {assignment.assignmentFileName}
            </p>
            {renderFileActions(
              assignment.assignmentFileUrl,
              assignment.assignmentFileName,
            )}
          </div>
        )}

        {/* SUBMITTED INFO */}
        {assignment.status === "Submitted" && assignment.submittedAt && (
          <div
            style={{
              padding: "10px",
              backgroundColor: "#dcfce7",
              borderRadius: "4px",
              marginBottom: "12px",
              fontSize: "12px",
              borderLeft: "3px solid #16a34a",
            }}
          >
            <p
              style={{
                margin: "0 0 4px 0",
                fontWeight: "600",
                color: "#166534",
              }}
            >
              ✅ Submitted On: {assignment.submittedAt}
            </p>
            {assignment.submittedFileName && (
              <>
                <p style={{ margin: "0", color: "#166534" }}>
                  📄 File: {assignment.submittedFileName}
                </p>
                {renderFileActions(
                  assignment.submittedFileUrl,
                  assignment.submittedFileName,
                )}
              </>
            )}
          </div>
        )}

        {/* SUBMISSION FORM */}
        {assignment.status === "Pending" && (
          <div
            style={{
              marginTop: "auto",
              paddingTop: "12px",
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "600",
                color: "#475569",
                marginBottom: "8px",
              }}
            >
              📤 Upload Your Assignment (PDF/DOC)
            </label>
            <input
              className="input"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
              onChange={handleFileChange}
              style={{ fontSize: "12px", padding: "8px", marginBottom: "8px" }}
            />
            {selectedFile && (
              <p
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "12px",
                  color: "#16a34a",
                  fontWeight: "600",
                }}
              >
                ✅ Selected: {selectedFile.name}
              </p>
            )}
            <button
              className="btn btn-success"
              onClick={() => onSubmit(assignment.id, selectedFile)}
              disabled={!selectedFile}
              style={{
                width: "100%",
                fontSize: "12px",
                fontWeight: "600",
                padding: "10px",
                opacity: !selectedFile ? 0.6 : 1,
                cursor: !selectedFile ? "not-allowed" : "pointer",
              }}
            >
              📤 Submit Assignment
            </button>
          </div>
        )}
      </div>
    );
  }

  // TEACHER VIEW
  return (
    <div className="card">
      {/* HEADER */}
      <div
        style={{
          marginBottom: "14px",
          paddingBottom: "12px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <h3
          style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "700" }}
        >
          {assignment.title}
        </h3>
        <p style={{ margin: "0", fontSize: "12px", color: "#64748b" }}>
          {assignment.subject} • Due: {assignment.dueDate}
        </p>
      </div>

      {/* SUMMARY */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          marginBottom: "14px",
        }}
      >
        <div
          style={{
            padding: "10px",
            backgroundColor: "#dcfce7",
            borderRadius: "6px",
          }}
        >
          <p
            style={{
              margin: "0 0 4px 0",
              fontSize: "12px",
              color: "#166534",
              fontWeight: "600",
            }}
          >
            ✅ Submitted
          </p>
          <p
            style={{
              margin: "0",
              fontSize: "18px",
              fontWeight: "700",
              color: "#16a34a",
            }}
          >
            {assignment.submittedCount || 0}
          </p>
        </div>

        <div
          style={{
            padding: "10px",
            backgroundColor: "#fef3c7",
            borderRadius: "6px",
          }}
        >
          <p
            style={{
              margin: "0 0 4px 0",
              fontSize: "12px",
              color: "#92400e",
              fontWeight: "600",
            }}
          >
            ⏳ Pending
          </p>
          <p
            style={{
              margin: "0",
              fontSize: "18px",
              fontWeight: "700",
              color: "#f59e0b",
            }}
          >
            {assignment.pendingCount || 0}
          </p>
        </div>
      </div>

      {assignment.assignmentFileName?.trim() && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#f0f9ff",
            borderRadius: "6px",
            marginBottom: "14px",
            fontSize: "12px",
          }}
        >
          <p
            style={{
              margin: "0 0 6px 0",
              fontWeight: "700",
              color: "#0c4a6e",
            }}
          >
            📎 Assignment File:
          </p>
          <p
            style={{
              margin: "0 0 10px 0",
              color: "#0369a1",
              wordBreak: "break-all",
            }}
          >
            {assignment.assignmentFileName}
          </p>
          {renderFileActions(
            assignment.assignmentFileUrl,
            assignment.assignmentFileName,
          )}
        </div>
      )}

      {/* STUDENT DETAILS */}
      {assignment.submissionsDetailed?.length > 0 && (
        <div>
          <h4
            style={{
              margin: "12px 0 8px 0",
              fontSize: "13px",
              fontWeight: "700",
              borderTop: "1px solid #e2e8f0",
              paddingTop: "12px",
            }}
          >
            📋 Student Submissions
          </h4>

          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {assignment.submissionsDetailed.map((item, idx) => (
              <div
                key={item.studentId}
                style={{
                  padding: "8px",
                  marginBottom: "6px",
                  backgroundColor:
                    item.status === "Submitted" ? "#f0fdf4" : "#fafafa",
                  border: `1px solid ${
                    item.status === "Submitted" ? "#86efac" : "#e5e7eb"
                  }`,
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "4px",
                  }}
                >
                  <strong>{item.studentName}</strong>
                  <span
                    className={`badge ${
                      item.status === "Submitted"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                    style={{ fontSize: "10px" }}
                  >
                    {item.status}
                  </span>
                </div>
                {item.submittedAt && (
                  <p
                    style={{
                      margin: "0",
                      color: "#64748b",
                      fontSize: "11px",
                    }}
                  >
                    Submitted: {item.submittedAt}
                  </p>
                )}
                {item.submittedFileName && (
                  <>
                    <p
                      style={{
                        margin: "4px 0 0 0",
                        color: "#2563eb",
                        fontSize: "11px",
                        wordBreak: "break-all",
                      }}
                    >
                      📄 {item.submittedFileName}
                    </p>
                    {renderFileActions(
                      item.submittedFileUrl,
                      item.submittedFileName,
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AssignmentCard;
