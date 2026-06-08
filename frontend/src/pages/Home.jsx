import "./Home.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const assignments = useSelector((state) => state.assignments?.assignments || []);
  const attendanceData = useSelector((state) => state.attendance?.records || []);
  const libraryBooks = useSelector((state) => state.library?.books || []);
  const storeItems = useSelector((state) => state.products?.items || []);
  const cartItems = useSelector((state) => state.cart?.items || []);
  const { currentUser } = useSelector((state) => state.auth || { currentUser: null });

  const role = currentUser?.role?.toLowerCase();

  // Teacher stats
  const totalAssignments = assignments.length;

  const totalStudents = [...new Set(attendanceData.map((item) => item.studentId))].length;

  const submittedCount = assignments.reduce((total, assignment) => {
    return (
      total +
      (assignment.submissions?.filter((sub) => sub.status === "Submitted").length || 0)
    );
  }, 0);

  const pendingCount = assignments.reduce((total, assignment) => {
    return (
      total +
      (assignment.submissions?.filter((sub) => sub.status !== "Submitted").length || 0)
    );
  }, 0);

  // Student assignment stats
  const studentAssignments = assignments.map((assignment) => {
    const submission = assignment.submissions?.find(
      (item) => item.studentId === currentUser?.id
    );

    return {
      ...assignment,
      status: submission?.status || "Pending",
    };
  });

  const studentPendingAssignments = studentAssignments.filter(
    (item) => item.status === "Pending"
  ).length;

  const studentSubmittedAssignments = studentAssignments.filter(
    (item) => item.status === "Submitted"
  ).length;

  // Student attendance stats
  const studentAttendance = attendanceData.filter(
    (item) => item.studentId === currentUser?.id
  );

  const totalAttended = studentAttendance.reduce(
    (sum, item) => sum + Number(item.attended || 0),
    0
  );

  const totalClasses = studentAttendance.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  const overallAttendance =
    totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;

  const teacherCards = [
    {
      title: "Total Assignments",
      value: totalAssignments,
      icon: "📝",
      desc: "All created assignments",
      path: "/assignments",
    },
    {
      title: "Student Records",
      value: totalStudents,
      icon: "👨‍🎓",
      desc: "Students available in attendance",
      path: "/teacher-dashboard",
    },
    {
      title: "Submitted Work",
      value: submittedCount,
      icon: "✅",
      desc: "Assignments submitted by students",
      path: "/assignments",
    },
    {
      title: "Pending Work",
      value: pendingCount,
      icon: "⏳",
      desc: "Assignments still pending",
      path: "/assignments",
    },
    {
      title: "Library Books",
      value: libraryBooks.length,
      icon: "📚",
      desc: "Available library resources",
      path: "/library",
    },
    {
      title: "Store Items",
      value: storeItems.length,
      icon: "🛍️",
      desc: "Items in academic store",
      path: "/store",
    },
  ];

  const studentCards = [
    {
      title: "Pending Assignments",
      value: studentPendingAssignments,
      icon: "⏳",
      desc: "Assignments not submitted yet",
      path: "/assignments",
    },
    {
      title: "Submitted Assignments",
      value: studentSubmittedAssignments,
      icon: "✅",
      desc: "Assignments already submitted",
      path: "/assignments",
    },
    {
      title: "Attendance",
      value: `${overallAttendance}%`,
      icon: "📅",
      desc: "Your overall attendance",
      path: "/attendance",
    },
    {
      title: "Library Books",
      value: libraryBooks.length,
      icon: "📚",
      desc: "Books you can explore",
      path: "/library",
    },
    {
      title: "Store Items",
      value: storeItems.length,
      icon: "🛍️",
      desc: "Available academic products",
      path: "/store",
    },
    {
      title: "Cart Items",
      value: cartItems.length,
      icon: "🛒",
      desc: "Items added in your cart",
      path: "/cart",
    },
  ];

  const cards = role === "teacher" ? teacherCards : studentCards;

  return (
    <div className="dashboard-home">
      <div className="dashboard-hero">
        <div className="dashboard-hero-left">
          <span className="dashboard-badge">
            {role === "teacher" ? "Teacher Dashboard" : "Student Dashboard"}
          </span>

          <h1>Welcome, {currentUser?.name || "User"} 👋</h1>

          <p>
            {role === "teacher"
              ? "Manage assignments, student progress, attendance, library resources, and store activities from one smart dashboard."
              : "Track your assignments, attendance, library resources, store items, and cart details from one simple dashboard."}
          </p>

          <div className="dashboard-tags">
            <span onClick={() => navigate("/assignments")}>Assignments</span>
            <span onClick={() => navigate("/attendance")}>Attendance</span>
            <span onClick={() => navigate("/library")}>Library</span>
            <span onClick={() => navigate("/store")}>Store</span>
            <span onClick={() => navigate("/cart")}>Cart</span>
          </div>
        </div>

        <div className="dashboard-hero-right">
          <div className="hero-info-card">
            <h3>Portal Overview</h3>
            <ul>
              <li>✔ Role-based dashboard access</li>
              <li>✔ Easy academic management</li>
              <li>✔ Clear status tracking</li>
              <li>✔ Organized resources</li>
              <li>✔ Better user experience</li>
              <li>✔ Efficient academic workflows</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Quick Overview</h2>
          <p>
            {role === "teacher"
              ? "A quick summary of academic activities and student progress."
              : "A quick summary of your academic performance and resources."}
          </p>
        </div>

        <div className="dashboard-card-grid">
          {cards.map((card, index) => (
            <div
              className="dashboard-card clickable-card"
              key={index}
              onClick={() => navigate(card.path)}
            >
              <div className="dashboard-card-top">
                <div className="dashboard-card-icon">{card.icon}</div>
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>
              </div>
              <h2 className="dashboard-card-value">{card.value}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-bottom-grid">
        <div
          className="dashboard-panel left-panel clickable-panel"
          onClick={() =>
            navigate(role === "teacher" ? "/teacher-dashboard" : "/student-dashboard")
          }
        >
          <h3>{role === "teacher" ? "Teacher Access" : "Student Access"}</h3>
          <p>
            {role === "teacher"
              ? "Teachers can create assignments, review submissions, track attendance, and manage academic content in a structured system."
              : "Students can view assignments, monitor attendance, browse library books, and manage cart items easily."}
          </p>
        </div>

        <div className="dashboard-panel right-panel">
          <h3>Available Modules</h3>
          <div className="module-list">
            <span onClick={() => navigate("/assignments")}>📝 Assignments</span>
            <span onClick={() => navigate("/attendance")}>📅 Attendance</span>
            <span onClick={() => navigate("/library")}>📚 Library</span>
            <span onClick={() => navigate("/store")}>🛍️ Store</span>
            <span onClick={() => navigate("/cart")}>🛒 Cart</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;