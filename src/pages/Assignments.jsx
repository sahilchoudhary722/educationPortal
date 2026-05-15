import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitAssignment } from "../features/assignment/assignmentSlice";
import AssignmentCard from "../components/AssignmentCard";

function Assignments() {
  const dispatch = useDispatch();

  // ================= REDUX STATE =================

  const assignments = useSelector(
    (state) => state?.assignments?.assignments ?? [],
  );

  const currentUser = useSelector((state) => state?.auth?.currentUser ?? null);

  // IMPORTANT FIX
  // pehle state.users.users use ho rha tha
  // ab direct auth.users use hoga
  const users = useSelector((state) => state?.auth?.users ?? []);

  const [successMessage, setSuccessMessage] = useState("");

  const [filterView, setFilterView] = useState("all");

  // ================= ALL STUDENTS =================

  const students = users.filter((user) => user.role === "student");

  // ================= SUBMIT ASSIGNMENT =================

  const handleSubmit = (assignmentId, selectedFile) => {
    dispatch(
      submitAssignment({
        assignmentId,
        studentId: currentUser.id,
        submittedFileName: selectedFile?.name || "",
        submittedFileType: selectedFile?.type || "",
      }),
    );

    setSuccessMessage("Assignment submitted successfully! ✅");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  // ================= PREPARE ASSIGNMENT LIST =================

  const assignmentList =
    currentUser?.role === "student"
      ? assignments.map((assignment) => {
          const submissions = Array.isArray(assignment.submissions)
            ? assignment.submissions
            : [];

          const submission = submissions.find(
            (item) => item.studentId === currentUser.id,
          );

          return {
            ...assignment,

            status: submission?.status || "Pending",

            submittedAt: submission?.submittedAt || "",

            submittedFileName: submission?.submittedFileName || "",

            submittedFileType: submission?.submittedFileType || "",
          };
        })
      : assignments.map((assignment) => {
          const submissions = Array.isArray(assignment.submissions)
            ? assignment.submissions
            : [];

          // ================= IMPORTANT FIX =================
          // ab har assignment me saare students dikhenge

          const submissionsDetailed = students.map((student) => {
            const existingSubmission = submissions.find(
              (sub) => sub.studentId === student.id,
            );

            return {
              studentId: student.id,

              studentName: student.name,

              status: existingSubmission?.status || "Pending",

              submittedAt: existingSubmission?.submittedAt || "",

              submittedFileName: existingSubmission?.submittedFileName || "",

              submittedFileType: existingSubmission?.submittedFileType || "",
            };
          });

          return {
            ...assignment,

            pendingCount: submissionsDetailed.filter(
              (item) => item.status === "Pending",
            ).length,

            submittedCount: submissionsDetailed.filter(
              (item) => item.status === "Submitted",
            ).length,

            submissionsDetailed,
          };
        });

  // ================= STUDENT FILTERS =================

  const pendingAssignments =
    currentUser?.role === "student"
      ? assignmentList.filter((item) => item.status === "Pending")
      : [];

  const submittedAssignments =
    currentUser?.role === "student"
      ? assignmentList.filter((item) => item.status === "Submitted")
      : [];

  // ================= TEACHER FILTERS =================

  const filteredAssignmentList =
    filterView === "all"
      ? assignmentList
      : filterView === "pending"
        ? assignmentList.filter((a) => a.pendingCount > 0)
        : assignmentList.filter((a) => a.submittedCount > 0);

  return (
    <div style={{ padding: "20px" }}>
      {/* ================= HEADER ================= */}

      <div
        style={{
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            margin: "0 0 8px 0",
            fontWeight: "700",
          }}
        >
          📝 Assignments Management
        </h1>

        <p
          style={{
            margin: "0",
            color: "#64748b",
          }}
        >
          Manage and track assignment submissions
        </p>
      </div>

      {/* ================= SUCCESS MESSAGE ================= */}

      {successMessage && (
        <div
          style={{
            marginBottom: "20px",
            padding: "12px 16px",
            backgroundColor: "#dcfce7",
            border: "1px solid #86efac",
            borderRadius: "6px",
            color: "#166534",
            fontWeight: "600",
          }}
        >
          {successMessage}
        </div>
      )}

      {/* ================= STUDENT VIEW ================= */}

      {currentUser?.role === "student" && (
        <>
          {/* SUMMARY */}

          <div
            className="grid-3"
            style={{
              marginBottom: "24px",
            }}
          >
            <div className="card">
              <h3>📋 Total Assignments</h3>

              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                }}
              >
                {assignmentList.length}
              </p>
            </div>

            <div className="card">
              <h3>⏳ Pending</h3>

              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "#f59e0b",
                }}
              >
                {pendingAssignments.length}
              </p>
            </div>

            <div className="card">
              <h3>✅ Submitted</h3>

              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "#16a34a",
                }}
              >
                {submittedAssignments.length}
              </p>
            </div>
          </div>

          {/* PENDING */}

          <div
            className="grid-2"
            style={{
              marginBottom: "30px",
            }}
          >
            {pendingAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                currentUser={currentUser}
                onSubmit={handleSubmit}
              />
            ))}
          </div>

          {/* SUBMITTED */}

          <div className="grid-2">
            {submittedAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                currentUser={currentUser}
                onSubmit={handleSubmit}
              />
            ))}
          </div>
        </>
      )}

      {/* ================= TEACHER VIEW ================= */}

      {currentUser?.role === "teacher" && (
        <>
          {/* SUMMARY */}

          <div
            className="grid-3"
            style={{
              marginBottom: "24px",
            }}
          >
            <div className="card">
              <h3>📋 Total Assignments</h3>

              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "#2563eb",
                }}
              >
                {assignmentList.length}
              </p>
            </div>

            <div className="card">
              <h3>⏳ Pending</h3>

              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "#f59e0b",
                }}
              >
                {filteredAssignmentList.reduce(
                  (acc, assignment) => acc + assignment.pendingCount,
                  0,
                )}
              </p>
            </div>

            <div className="card">
              <h3>✅ Submitted</h3>

              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "#16a34a",
                }}
              >
                {filteredAssignmentList.reduce(
                  (acc, assignment) => acc + assignment.submittedCount,
                  0,
                )}
              </p>
            </div>
          </div>

          {/* FILTER */}

          <div
            className="card"
            style={{
              marginBottom: "24px",
            }}
          >
            <h2 className="section-title">🔍 Filter Assignments</h2>

            <select
              className="input"
              value={filterView}
              onChange={(e) => setFilterView(e.target.value)}
              style={{
                maxWidth: "250px",
              }}
            >
              <option value="all">All Assignments</option>

              <option value="pending">Pending Submissions</option>

              <option value="submitted">Submitted Assignments</option>
            </select>
          </div>

          {/* ASSIGNMENT CARDS */}

          <div className="grid-2">
            {filteredAssignmentList.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                currentUser={currentUser}
                onSubmit={handleSubmit}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Assignments;
