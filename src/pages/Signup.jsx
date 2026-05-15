import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { addStudentAttendance } from "../features/attendance/attendanceSlice";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    course: "",
    semester: "",
    rollNumber: "",
    department: "",
    profileImage: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage") {
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profileImage: reader.result,
        }));
      };

      if (files[0]) {
        reader.readAsDataURL(files[0]);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

   const newStudent = {
  id: Date.now(),
  ...formData,
};

dispatch(signupUser(newStudent));

if (formData.role === "student") {
  dispatch(
    addStudentAttendance(newStudent),
  );
}

    navigate("/login");
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-card-modern">
          <div className="login-left">
            <div className="login-logo-circle">📝</div>

            <h1 className="login-main-title">Create Account</h1>

            <form className="form-grid" onSubmit={handleSubmit}>
              <input
                className="input input-modern"
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                className="input input-modern"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                className="input input-modern"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <select
                className="input input-modern"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>

              {formData.role === "student" ? (
                <>
                  <input
                    className="input input-modern"
                    type="text"
                    name="course"
                    placeholder="Course"
                    value={formData.course}
                    onChange={handleChange}
                  />

                  <input
                    className="input input-modern"
                    type="text"
                    name="semester"
                    placeholder="Semester"
                    value={formData.semester}
                    onChange={handleChange}
                  />

                  <input
                    className="input input-modern"
                    type="text"
                    name="rollNumber"
                    placeholder="Roll Number"
                    value={formData.rollNumber}
                    onChange={handleChange}
                  />
                </>
              ) : (
                <input
                  className="input input-modern"
                  type="text"
                  name="department"
                  placeholder="Department"
                  value={formData.department}
                  onChange={handleChange}
                />
              )}

              <input
                className="input"
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
              />

              <button className="btn login-btn-modern" type="submit">
                Sign Up
              </button>
            </form>

            {error && <p className="login-error">{error}</p>}

            <p style={{ marginTop: "20px" }}>
              Already have account? <Link to="/login">Login</Link>
            </p>
          </div>

          <div className="login-right">
            <div className="login-illustration-card">
              <div className="login-badge">EduManage Portal</div>

              <h2>Create your academic profile</h2>

              <p>
                Signup as Student or Teacher and access your dashboard,
                assignments, library, attendance and more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
