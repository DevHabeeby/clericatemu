
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  ShoppingBag,
  CreditCard,
  LockKeyhole,
  Truck,
  Smartphone,
  Wallet,
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
  });

  const [selectedPayment, setSelectedPayment] =
    useState("visa");

  const [demoCard, setDemoCard] = useState({
    holder: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  const [error, setError] = useState("");
  const [orderCompleted, setOrderCompleted] =
    useState(false);

  const [completedTotal, setCompletedTotal] =
    useState(0);

  const [completedMethod, setCompletedMethod] =
    useState("");

  const [customerName, setCustomerName] =
    useState("");

  // Calculate cart total
  const total = cart.reduce((sum, item) => {
    const discountedPrice =
      item.price -
      (item.price * (item.discountPercentage || 0)) /
        100;

    return (
      sum +
      toNaira(discountedPrice) * item.quantity
    );
  }, 0);

  // Delivery form
  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  // Demo card form
  const updateDemoCard = (field, value) => {
    setDemoCard((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // Format demo card number as user types
  const formatDemoCardNumber = (value) => {
    const digits = value
      .replace(/\D/g, "")
      .slice(0, 19);

    return digits
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  // Display only the final four demo digits
  const maskedDemoCard = () => {
    const digits = demoCard.number.replace(/\D/g, "");
    const lastFour = digits.slice(-4).padStart(4, "0");

    return `•••• •••• •••• ${lastFour}`;
  };

  // Complete demo order
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.address.trim()
    ) {
      setError(
        "Please complete all delivery information."
      );
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    // Require demo fields for card demo
    if (
      selectedPayment === "visa" ||
      selectedPayment === "verve"
    ) {
      if (
        !demoCard.holder.trim() ||
        !demoCard.number.trim() ||
        !demoCard.expiry.trim() ||
        !demoCard.cvv.trim()
      ) {
        setError(
          "Please complete the demo card fields using fake demo values."
        );
        return;
      }
    }

    const paymentNames = {
      visa: "Visa Card Demo",
      verve: "Verve Card Demo",
      opay: "OPay Demo",
      google: "Google Pay Demo",
      cash: "Cash on Delivery",
    };

    setCompletedTotal(total);

    setCompletedMethod(
      paymentNames[selectedPayment] || "Payment Demo"
    );

    setCustomerName(form.name);

    // No payment API is called
    // No card details are sent to a server
    clearCart();

    // Clear demo card fields after simulation
    setDemoCard({
      holder: "",
      number: "",
      expiry: "",
      cvv: "",
    });

    setOrderCompleted(true);
  };

  // Order confirmation
  if (orderCompleted) {
    return (
      <main className="container section">
        <div className="payment-success">
          <CheckCircle
            size={75}
            color="#16a34a"
          />

          <p className="eyebrow">
            ORDER CONFIRMED
          </p>

          <h1>Demo Payment Successful!</h1>

          <p>
            Thank you, {customerName}!
          </p>

          <p>
            Your demonstration order has been completed.
          </p>

          <p>
            Payment Method:{" "}
            <strong>{completedMethod}</strong>
          </p>

          <p>
            Order Total:{" "}
            <strong>
              {formatNaira(completedTotal)}
            </strong>
          </p>

          <p className="secure-note">
            This is a frontend project demonstration.
            No real payment was processed.
          </p>

          <Link
            to="/"
            className="primary-btn"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  // Empty cart
  if (cart.length === 0) {
    return (
      <main className="container section empty-cart">
        <h2>Your cart is empty</h2>

        <Link
          to="/products"
          className="primary-btn"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="container section checkout-page">
      <Link
        to="/cart"
        className="back-link"
      >
        <ArrowLeft size={18} />
        Back to cart
      </Link>

      <div className="checkout-heading">
        <p className="eyebrow">CHECKOUT</p>

        <h1>Complete Your Order</h1>

        <p>
          Enter your delivery information and
          choose a payment method.
        </p>
      </div>

      <div className="checkout-layout">
        <form
          className="checkout-form"
          onSubmit={handleSubmit}
        >
          <h2>Delivery Information</h2>

          <label htmlFor="checkout-name">
            Full Name
          </label>

          <input
            id="checkout-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            autoComplete="name"
            required
          />

          <label htmlFor="checkout-email">
            Email Address
          </label>

          <input
            id="checkout-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="example@email.com"
            autoComplete="email"
            required
          />

          <label htmlFor="checkout-phone">
            Phone Number
          </label>

          <input
            id="checkout-phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="Your phone number"
            autoComplete="tel"
            required
          />

          <label htmlFor="checkout-address">
            Delivery Address
          </label>

          <textarea
            id="checkout-address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter your delivery address"
            rows={4}
            autoComplete="street-address"
            required
          />

          {/* Payment choices */}
          <section className="payment-choice-section">
            <h2>Payment Method</h2>

            <div className="payment-choice-grid">
              {/* OPay */}
              <button
                type="button"
                className={`payment-choice ${
                  selectedPayment === "opay"
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setSelectedPayment("opay");
                  setError("");
                }}
              >
                <span className="payment-logo">
                  <Wallet size={24} />
                </span>

                <span className="payment-choice-text">
                  <strong>OPay</strong>
                  <small>Payment demo</small>
                </span>

                <span className="payment-radio">
                  {selectedPayment === "opay" && (
                    <CheckCircle
                      size={22}
                      color="#ff6900"
                    />
                  )}
                </span>
              </button>

              {/* Visa */}
              <button
                type="button"
                className={`payment-choice ${
                  selectedPayment === "visa"
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setSelectedPayment("visa");
                  setError("");
                }}
              >
                <span className="payment-logo">
                  <CreditCard size={24} />
                </span>

                <span className="payment-choice-text">
                  <strong>Visa</strong>
                  <small>Card payment demo</small>
                </span>

                <span className="payment-radio">
                  {selectedPayment === "visa" && (
                    <CheckCircle
                      size={22}
                      color="#ff6900"
                    />
                  )}
                </span>
              </button>

              {/* Verve */}
              <button
                type="button"
                className={`payment-choice ${
                  selectedPayment === "verve"
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setSelectedPayment("verve");
                  setError("");
                }}
              >
                <span className="payment-logo">
                  <CreditCard size={24} />
                </span>

                <span className="payment-choice-text">
                  <strong>Verve</strong>
                  <small>Card payment demo</small>
                </span>

                <span className="payment-radio">
                  {selectedPayment === "verve" && (
                    <CheckCircle
                      size={22}
                      color="#ff6900"
                    />
                  )}
                </span>
              </button>

              {/* Google Pay */}
              <button
                type="button"
                className={`payment-choice ${
                  selectedPayment === "google"
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setSelectedPayment("google");
                  setError("");
                }}
              >
                <span className="payment-logo">
                  <Smartphone size={24} />
                </span>

                <span className="payment-choice-text">
                  <strong>Google Pay</strong>
                  <small>Payment demo</small>
                </span>

                <span className="payment-radio">
                  {selectedPayment === "google" && (
                    <CheckCircle
                      size={22}
                      color="#ff6900"
                    />
                  )}
                </span>
              </button>

              {/* Cash on delivery */}
              <button
                type="button"
                className={`payment-choice ${
                  selectedPayment === "cash"
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setSelectedPayment("cash");
                  setError("");
                }}
              >
                <span className="payment-logo">
                  <Truck size={24} />
                </span>

                <span className="payment-choice-text">
                  <strong>Cash on Delivery</strong>
                  <small>Pay when order arrives</small>
                </span>

                <span className="payment-radio">
                  {selectedPayment === "cash" && (
                    <CheckCircle
                      size={22}
                      color="#ff6900"
                    />
                  )}
                </span>
              </button>
            </div>
          </section>

          {/* Demo card form */}
          {(selectedPayment === "visa" ||
            selectedPayment === "verve") && (
            <section className="payment-detail-panel">
              <div className="payment-detail-heading">
                <CreditCard size={23} />

                <h3>
                  {selectedPayment === "visa"
                    ? "Visa Card"
                    : "Verve Card"}
                </h3>
              </div>

              {/* Orange card preview */}
              <div className="demo-card-banner">
                <div>
                  <span>DEMO CARD</span>
                  <strong>{maskedDemoCard()}</strong>
                </div>

                <CreditCard size={34} />
              </div>

              <p className="secure-note">
                Demo checkout only. Use fake sample values.
                Do not enter real card information.
                These fields are not connected to a payment
                service.
              </p>

              <label htmlFor="demo-cardholder">
                Cardholder Name
              </label>

              <input
                id="demo-cardholder"
                type="text"
                placeholder="DEMO CARDHOLDER"
                autoComplete="off"
                value={demoCard.holder}
                onChange={(e) =>
                  updateDemoCard("holder", e.target.value)
                }
              />

              <label htmlFor="demo-card-number">
                Demo Card Number
              </label>

              <input
                id="demo-card-number"
                type="text"
                placeholder="Enter fake demo card number"
                inputMode="numeric"
                autoComplete="off"
                value={demoCard.number}
                onChange={(e) =>
                  updateDemoCard(
                    "number",
                    formatDemoCardNumber(e.target.value)
                  )
                }
              />

              <div className="card-input-row">
                <div>
                  <label htmlFor="demo-expiry">
                    Expiry Date
                  </label>

                  <input
                    id="demo-expiry"
                    type="text"
                    placeholder="MM/YY"
                    autoComplete="off"
                    value={demoCard.expiry}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/[^0-9/]/g, "")
                        .slice(0, 5);

                      updateDemoCard("expiry", value);
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="demo-cvv">
                    Demo CVV
                  </label>

                  <input
                    id="demo-cvv"
                    type="text"
                    placeholder="Demo CVV"
                    inputMode="numeric"
                    autoComplete="off"
                    value={demoCard.cvv}
                    onChange={(e) =>
                      updateDemoCard(
                        "cvv",
                        e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 4)
                      )
                    }
                  />
                </div>
              </div>

              <div className="demo-card-notice">
                <LockKeyhole size={16} />
                Frontend payment simulation
              </div>
            </section>
          )}

          {/* OPay demo */}
          {selectedPayment === "opay" && (
            <section className="payment-detail-panel">
              <div className="payment-detail-heading">
                <Wallet size={23} />
                <h3>OPay Demo</h3>
              </div>

              <p>
                OPay is selected for this demonstration.
                No payment will be sent.
              </p>
            </section>
          )}

          {/* Google Pay demo */}
          {selectedPayment === "google" && (
            <section className="payment-detail-panel">
              <div className="payment-detail-heading">
                <Smartphone size={23} />
                <h3>Google Pay Demo</h3>
              </div>

              <p>
                Google Pay is selected for this
                frontend demonstration.
              </p>
            </section>
          )}

          {/* Cash on delivery */}
          {selectedPayment === "cash" && (
            <section className="payment-detail-panel">
              <div className="payment-detail-heading">
                <Truck size={23} />
                <h3>Cash on Delivery</h3>
              </div>

              <p>
                Pay when your order arrives.
                This is a demonstration order.
              </p>
            </section>
          )}

          {error && (
            <p
              className="error-message"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="primary-btn checkout-submit"
          >
            Pay Now — Demo Only —{" "}
            {formatNaira(total)}
          </button>

          <p className="secure-note">
            <LockKeyhole size={15} />
            Frontend demonstration only.
            No real payment is processed.
          </p>
        </form>

        {/* Order summary */}
        <aside className="checkout-summary">
          <h2>Order Summary</h2>

          {cart.map((item) => {
            const discountedPrice =
              item.price -
              (item.price *
                (item.discountPercentage || 0)) /
                100;

            const itemTotal =
              toNaira(discountedPrice) *
              item.quantity;

            return (
              <div
                className="checkout-product"
                key={item.id}
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                />

                <div>
                  <strong>{item.title}</strong>

                  <p>
                    Quantity: {item.quantity}
                  </p>
                </div>

                <span>
                  {formatNaira(itemTotal)}
                </span>
              </div>
            );
          })}

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
