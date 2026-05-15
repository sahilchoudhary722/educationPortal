import { Link } from "react-router-dom";

function StudentInfoCard({ student }) {
  return (
    <div className="card">
      <h2 className="section-title">{student.name}</h2>

      <p style={{ marginBottom: "8px" }}>
        <strong>Roll Number:</strong> {student.rollNumber}
      </p>

      <p style={{ marginBottom: "8px" }}>
        <strong>Course:</strong> {student.course}
      </p>

      <p style={{ marginBottom: "8px" }}>
        <strong>Semester:</strong> {student.semester}
      </p>

      <p style={{ marginBottom: "12px" }}>
        <strong>Email:</strong> {student.email}
      </p>

      <Link to={`/students/${student.id}`} className="btn btn-primary">
        View Profile
      </Link>
    </div>
  );
}

export default StudentInfoCard;