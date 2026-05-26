function CartItemCard({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  return (
    <div className="card">

      <img
        src={item.image}
        alt={item.title}
        style={{
          width: "100%",
          height: "160px",
          objectFit: "contain",
          marginBottom: "14px",
          borderRadius: "10px",
          backgroundColor: "#fff",
        }}
      />

      <h3 style={{ marginBottom: "10px" }}>
        {item.title}
      </h3>

      <p style={{ marginBottom: "8px" }}>
        <strong>Category:</strong> {item.category}
      </p>

      <p style={{ marginBottom: "8px" }}>
        <strong>Price:</strong> ₹{item.price}
      </p>

      <p style={{ marginBottom: "14px" }}>
        <strong>Quantity:</strong> {item.quantity}
      </p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <button
          className="btn btn-primary"
          onClick={() => onIncrease(item.id)}
        >
          +
        </button>

        <button
          className="btn btn-outline"
          onClick={() => onDecrease(item.id)}
        >
          -
        </button>

        <button
          className="btn btn-danger"
          onClick={() => onRemove(item.id)}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItemCard;