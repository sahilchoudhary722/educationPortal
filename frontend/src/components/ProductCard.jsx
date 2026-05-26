function ProductCard({ product, onAddToCart }) {
  return (
    <div className="card">
      <img
        src={product.image}
        alt={product.title}
        style={{
          width: "100%",
          height: "140px",
          objectFit: "contain",
          backgroundColor: "#fff",
          borderRadius: "12px",
          marginBottom: "14px",
        }}
      />

      <h3 style={{ marginBottom: "10px" }}>{product.title}</h3>

      <p style={{ marginBottom: "10px" }}>
        <strong>Category:</strong> {product.category}
      </p>

      <p
        style={{
          marginBottom: "16px",
          fontWeight: "bold",
          color: "#16a34a",
        }}
      >
        ₹{product.price}
      </p>

      <button
        className="btn btn-primary"
        onClick={() => onAddToCart(product)}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;