import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAssignment } from "../features/assignment/assignmentSlice";
import { useNavigate } from "react-router-dom";

function AddAssignment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    dueDate: "",
  });

  const [assignmentFile, setAssignmentFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAssignmentFile(file || null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      addAssignment({
        title: formData.title,
        subject: formData.subject,
        dueDate: formData.dueDate,
        assignedBy: currentUser?.name || "Teacher",
        assignmentFileName: assignmentFile?.name || "",
        assignmentFileType: assignmentFile?.type || "",
      })
    );

    setSuccessMessage("Assignment uploaded successfully.");

    setTimeout(() => {
      navigate("/assignments");
    }, 1200);
  };

  return (
    <div className="card" style={{ maxWidth: "600px" }}>
      <h1 className="page-title">Add Assignment</h1>

      {successMessage && <div className="success-message">{successMessage}</div>}

      <form className="form-grid" onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          name="title"
          placeholder="Assignment title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          className="input"
          type="text"
          name="subject"
          placeholder="Subject name"
          value={formData.subject}
          onChange={handleChange}
          required
        />

        <input
          className="input"
          type="text"
          name="dueDate"
          placeholder="Due date (e.g. 20 Mar 2026)"
          value={formData.dueDate}
          onChange={handleChange}
          required
        />

        <div>
          <label className="file-label">Upload Assignment PDF/File</label>
          <input
            className="input"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />
          {assignmentFile && (
            <p className="file-name-text">Selected File: {assignmentFile.name}</p>
          )}
        </div>

        <button className="btn btn-success" type="submit">
          Upload Assignment
        </button>
      </form>
    </div>
  );
}

export default AddAssignment;