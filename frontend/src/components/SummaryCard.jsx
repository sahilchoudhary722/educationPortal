function SummaryCard({ title, value, color = "#2563eb" }) {
  return (
    <div className="card">
      <p style={{ color: "#475569", marginBottom: "10px" }}>{title}</p>
      <h2 style={{ color, fontSize: "28px" }}>{value}</h2>
    </div>
  );
}

export default SummaryCard;