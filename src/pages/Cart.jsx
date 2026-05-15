import { useDispatch, useSelector } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../features/cart/cartSlice";
import CartItemCard from "../components/CartItemCard";

function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h1 className="page-title">Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-state">Your cart is empty.</div>
      ) : (
        <>
          <div className="grid-2">
            {cartItems.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onIncrease={(id) => dispatch(increaseQuantity(id))}
                onDecrease={(id) => dispatch(decreaseQuantity(id))}
                onRemove={(id) => dispatch(removeFromCart(id))}
              />
            ))}
          </div>

          <div className="card" style={{ marginTop: "20px" }}>
            <h2 className="section-title">Order Summary</h2>
            <p style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "16px" }}>
              Total: ₹{totalAmount}
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button className="btn btn-success">Proceed to Buy</button>
              <button className="btn btn-danger" onClick={() => dispatch(clearCart())}>
                Clear Cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;