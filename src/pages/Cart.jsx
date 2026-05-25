import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../features/cart/cartSlice";
import CartItemCard from "../components/CartItemCard";
import { post } from "../api/api";

function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const currentUser = useSelector((state) => state.auth.currentUser);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
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
            <p
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                marginBottom: "16px",
              }}
            >
              Total: ₹{totalAmount}
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                className="btn btn-success"
                onClick={() => setIsCheckoutOpen(true)}
              >
                Proceed to Buy
              </button>
              <button
                className="btn btn-danger"
                onClick={() => dispatch(clearCart())}
              >
                Clear Cart
              </button>
            </div>

            {orderSuccess && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "12px 14px",
                  backgroundColor: "#dcfce7",
                  border: "1px solid #86efac",
                  borderRadius: "8px",
                  color: "#166534",
                }}
              >
                {orderSuccess}
              </div>
            )}
          </div>

          {isCheckoutOpen && (
            <div className="card" style={{ marginTop: "20px" }}>
              <h2 className="section-title">Checkout</h2>

              {orderError && (
                <div
                  style={{
                    marginBottom: "16px",
                    padding: "12px 14px",
                    backgroundColor: "#fee2e2",
                    border: "1px solid #fca5a5",
                    borderRadius: "8px",
                    color: "#b91c1c",
                  }}
                >
                  {orderError}
                </div>
              )}

              <div style={{ marginBottom: "16px" }}>
                <p style={{ margin: "0 0 8px 0", fontWeight: "700" }}>
                  Buyer Information
                </p>
                <p style={{ margin: "0 0 4px 0" }}>
                  Name: <strong>{currentUser?.name || "-"}</strong>
                </p>
                <p style={{ margin: "0 0 4px 0" }}>
                  Email: <strong>{currentUser?.email || "-"}</strong>
                </p>
                <p style={{ margin: "0" }}>
                  Role: <strong>{currentUser?.role || "-"}</strong>
                </p>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                <label className="label">Delivery Address</label>
                <input
                  className="input"
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter delivery address"
                />

                <label className="label">Phone Number</label>
                <input
                  className="input"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                />

                <label className="label">Payment Method</label>
                <select
                  className="input"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="upi">UPI</option>
                  <option value="cash">Cash</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="credit_card">Credit Card</option>
                </select>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button
                    className="btn btn-success"
                    onClick={async () => {
                      setOrderError("");
                      if (!currentUser) {
                        setOrderError(
                          "Please log in to complete the purchase.",
                        );
                        return;
                      }
                      if (!deliveryAddress.trim()) {
                        setOrderError("Delivery address is required.");
                        return;
                      }
                      if (!phoneNumber.trim()) {
                        setOrderError("Phone number is required.");
                        return;
                      }
                      if (cartItems.length === 0) {
                        setOrderError("Your cart is empty.");
                        return;
                      }

                      setOrderLoading(true);

                      try {
                        const response = await post("/orders", {
                          items: cartItems.map((item) => ({
                            id: item.id,
                            title: item.title,
                            price: item.price,
                            quantity: item.quantity,
                          })),
                          totalAmount,
                          paymentMethod,
                          deliveryAddress,
                          phoneNumber,
                        });

                        setOrderSuccess(
                          `Purchase successful! Order ID: ${response.orderId}`,
                        );
                        setIsCheckoutOpen(false);
                        dispatch(clearCart());
                        setDeliveryAddress("");
                        setPhoneNumber("");
                      } catch (error) {
                        setOrderError(
                          error.message || "Failed to place order.",
                        );
                      } finally {
                        setOrderLoading(false);
                      }
                    }}
                    disabled={orderLoading}
                  >
                    {orderLoading ? "Processing..." : "Confirm Purchase"}
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setOrderError("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Cart;
