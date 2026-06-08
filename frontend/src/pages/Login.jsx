import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearAuthError } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, error, status } = useSelector(
    (state) => state.auth,
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
  });

  useEffect(() => {
    if (isAuthenticated && currentUser?.role === "student") {
      navigate("/student-dashboard");
    }

    if (isAuthenticated && currentUser?.role === "teacher") {
      navigate("/teacher-dashboard");
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleChange = (e) => {
    dispatch(clearAuthError());
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div className="login-page">
      <div className="login-bg-shape shape-1"></div>
      <div className="login-bg-shape shape-2"></div>
      <div className="login-bg-shape shape-3"></div>

      <div className="login-wrapper">
        <div className="login-card-modern">
          <div className="login-left">
            <div className="login-logo-circle">🎓</div>

            <h1 className="login-main-title">Welcome to EduManage</h1>
            <p className="login-subtitle">
              Smart academic portal for Students and Teachers
            </p>

            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="input-group-modern">
                <span className="input-icon">📧</span>
                <input
                  className="input input-modern"
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group-modern">
                <span className="input-icon">🔒</span>
                <input
                  className="input input-modern"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group-modern">
                <span className="input-icon">👤</span>
                <select
                  className="input input-modern"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>

              <button
                className="btn login-btn-modern"
                type="submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Logging in..." : "Login"}
              </button>
              <p style={{ marginTop: "20px" }}>
                Don't have account? <Link to="/signup">Signup</Link>
              </p>
            </form>

            {error && <p className="login-error">{error}</p>}
          </div>

          <div className="login-right">
            <div className="login-illustration-card">
              <div className="login-badge">EduManage Portal</div>
              <h2>One portal for complete academic management</h2>
              <p>
                Manage assignments, attendance, library records, store items,
                and student progress with a clean and modern dashboard.
              </p>

              <div className="login-feature-list">
                <span>Assignments</span>
                <span>Attendance</span>
                <span>Library</span>
                <span>Store</span>
                <span>Cart</span>
              </div>

              <div className="login-illustration">
                <div className="illustration-circle"></div>
                <div className="illustration-student">💻</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
