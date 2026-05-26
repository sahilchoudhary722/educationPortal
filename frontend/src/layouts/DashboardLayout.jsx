import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, loadUsers } from "../features/auth/authSlice";
import { loadAssignments } from "../features/assignment/assignmentSlice";
import { loadAttendance } from "../features/attendance/attendanceSlice";
import { loadLibrary } from "../features/library/librarySlice";
import { loadProducts } from "../features/products/productSlice";
import { loadCart } from "../features/cart/cartSlice";

function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart.items.length);

  useEffect(() => {
    if (!isAuthenticated) return;

    dispatch(loadUsers());
    dispatch(loadAssignments());
    dispatch(loadAttendance());
    dispatch(loadLibrary());
    dispatch(loadProducts());
    dispatch(loadCart());
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: "250px",
          background: "#0f172a",
          color: "white",
          padding: "20px",
        }}
      >
        <h2 style={{ marginBottom: "12px" }}>EduManage</h2>
        <p style={{ marginBottom: "6px" }}>{currentUser?.name}</p>
        <p style={{ textTransform: "capitalize", color: "#cbd5e1" }}>
          {currentUser?.role}
        </p>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "24px",
          }}
        >
          <Link to="/" style={linkStyle}>
            Home
          </Link>

          {currentUser?.role === "student" && (
            <Link to="/student-dashboard" style={linkStyle}>
              Student Dashboard
            </Link>
          )}

          {currentUser?.role === "teacher" && (
            <Link to="/teacher-dashboard" style={linkStyle}>
              Teacher Dashboard
            </Link>
          )}

          {currentUser?.role === "teacher" && (
            <Link to="/students" style={linkStyle}>
              Students
            </Link>
          )}

          <Link to="/assignments" style={linkStyle}>
            Assignments
          </Link>

          <Link to="/attendance" style={linkStyle}>
            Attendance
          </Link>

          <Link to="/library" style={linkStyle}>
            Library
          </Link>

          <Link to="/store" style={linkStyle}>
            Store
          </Link>

          <Link to="/cart" style={linkStyle}>
            Cart ({cartCount})
          </Link>

          {currentUser?.role === "teacher" && (
            <Link to="/add-assignment" style={linkStyle}>
              Add Assignment
            </Link>
          )}

          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: "24px" }}>
        <Outlet />
      </main>
    </div>
  );
}

const linkStyle = {
  color: "white",
  padding: "10px 12px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.08)",
  textDecoration: "none",
};

export default DashboardLayout;
