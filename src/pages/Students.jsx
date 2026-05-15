import { useSelector } from "react-redux";
import StudentInfoCard from "../components/StudentInfoCard";

function Students() {
  const users = useSelector((state) => state.auth.users);

  const students = users.filter(
    (user) => user.role === "student",
  );

  return (
    <div>
      <h1 className="page-title">Students</h1>

      {students.length === 0 ? (
        <div className="empty-state">
          No students found.
        </div>
      ) : (
        <div className="grid-2">
          {students.map((student) => (
            <StudentInfoCard
              key={student.id}
              student={student}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Students;