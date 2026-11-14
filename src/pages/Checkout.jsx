
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LockKeyhole,
  CreditCard,
  ArrowLeft,
  CheckCircle,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatNaira, toNaira } from "../utils/currency";

function Checkout() {
  const { cart, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [error, setError] = useState("");
  const [paid, setPaid] = useState(false);

  const total = cart.reduce((sum, item) => {
  const discountedPrice =
    item.price -
    (item.price * item.discountPercentage) / 100;

  return sum + toNaira(discountedPrice) * item.quantity;
}, 0) ;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    // Accept fictional demo details only.
    if (
      form.cardNumber.replace(/\s/g, "") !== "4242424242424242" ||
      form.expiry !== "12/30" ||
      form.cvv !== "123"
    ) {
      setError(
        "Invalid demo card details. Please use the sample details shown below."
      );
      return;
    }

    // Simulated payment: no API, no real charge.
    clearCart();
    setPaid(true);
  };

  if (paid) {
    return (
      <main className="container section">
        <div className="payment-success">
          <CheckCircle size={75} color="#16a34a" />

          <p className="eyebrow">DEMO PAYMENT COMPLETE</p>

          <h1>Payment Successful!</h1>

          <p>
            Thank you, {form.name}! Your demo order has been
            completed successfully.
          </p>

          <p>
            Order Total: <strong>{formatNaira(total)}</strong>
          </p>

          <p className="secure-note">
            This was a simulated payment. No money was charged.
          </p>

          <Link to="/" className="primary-btn">
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="container section empty-cart">
        <h2>Your cart is empty</h2>
        <Link to="/products" className="primary-btn">
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="container section checkout-page">
      <Link to="/cart" className="back-link">
        <ArrowLeft size={18} /> Back to cart
      </Link>

      <div className="checkout-heading">
        <p className="eyebrow">DEMO CHECKOUT</p>
        <h1>Complete Your Order</h1>
        <p>Enter your delivery and demo card information.</p>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handlePayment}>
          <h2>Delivery Information</h2>

          <label>Full Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />

          <label>Email Address</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="example@email.com"
            required
          />

          <label>Phone Number</label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="Your phone number"
            required
          />

          <label>Delivery Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Your delivery address"
            rows={4}
            required
          />

          <div className="demo-card">
            <div className="demo-card-heading">
              <CreditCard size={24} />
              <strong>Demo Card Details</strong>
            </div>

            <p>Input Your Card Details</p>

            <div className="demo-card-number">
              4242 4242 4242 4242
            </div>

            <div className="demo-card-bottom">
              <span>EXPIRY: 12/30</span>
              <span>CVV: 123</span>
            </div>

            <small>
              DEMO ONLY — Cleric A.
            </small>
          </div>

          <h2>Card Information</h2>

          <label>Demo Card Number</label>
          <input
            name="cardNumber"
            value={form.cardNumber}
            onChange={handleChange}
            placeholder="4242 4242 4242 4242"
            inputMode="numeric"
            maxLength={19}
            required
          />

          <div className="card-input-row">
            <div>
              <label>Expiry Date</label>
              <input
                name="expiry"
                value={form.expiry}
                onChange={handleChange}
                placeholder="12/30"
                maxLength={5}
                required
              />
            </div>

            <div>
              <label>CVV</label>
              <input
                name="cvv"
                type="password"
                value={form.cvv}
                onChange={handleChange}
                placeholder="123"
                maxLength={3}
                inputMode="numeric"
                required
              />
            </div>
          </div>

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="primary-btn checkout-submit"
          >
            Pay {formatNaira(total)}
          </button>

          <p className="secure-note">
            <LockKeyhole size={15} />
            Simulated checkout. No real payment is processed.
          </p>
        </form>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>

          {cart.map((item) => (
            <div className="checkout-product" key={item.id}>
              <img src={item.thumbnail} alt={item.title} />

              <div>
                <strong>{item.title}</strong>
                <p>Quantity: {item.quantity}</p>
              </div>

              <span>
  {formatNaira(
    toNaira(
      item.price -
      (item.price * item.discountPercentage) / 100
    ) * item.quantity
  )}
</span>
            </div>
          ))}

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{formatNaira(total)}</strong>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <strong>Free</strong>
          </div>

          <div className="summary-row total-row">
            <span>Total</span>
            <strong>{formatNaira(total)}</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default Checkout;
