import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

import StudentDashboard from "../pages/StudentDashboard";
import TeacherDashboard from "../pages/TeacherDashboard";

import Assignments from "../pages/Assignments";
import AddAssignment from "../pages/AddAssignment";
import Attendance from "../pages/Attendance";
import Library from "../pages/Library.jsx";
import Store from "../pages/Store";
import Cart from "../pages/Cart";
import NotFound from "../pages/NotFound";

import DashboardLayout from "../layouts/DashboardLayout";

import Students from "../pages/Students";
import StudentProfile from "../pages/StudentProfile";

function AppRouter() {
  const { isAuthenticated, currentUser } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        element={
          isAuthenticated ? (
            <DashboardLayout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route path="/home" element={<Home />} />

        <Route
          path="/student-dashboard"
          element={
            currentUser?.role === "student" ? (
              <StudentDashboard />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />

        <Route
          path="/teacher-dashboard"
          element={
            currentUser?.role === "teacher" ? (
              <TeacherDashboard />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />

        <Route
          path="/students"
          element={
            currentUser?.role === "teacher" ? (
              <Students />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />

        <Route
          path="/students/:studentId"
          element={
            currentUser?.role === "teacher" ? (
              <StudentProfile />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />

        <Route path="/assignments" element={<Assignments />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/library" element={<Library />} />
        <Route path="/store" element={<Store />} />
        <Route path="/cart" element={<Cart />} />

        <Route
          path="/add-assignment"
          element={
            currentUser?.role === "teacher" ? (
              <AddAssignment />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;