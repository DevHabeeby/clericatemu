
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  ShoppingBag,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  LockKeyhole,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { formatNaira, toNaira } from "../utils/currency";

const paymentOptions = [
  {
    id: "opay",
    name: "OPay",
    description: "OPay wallet payment",
    logo: "O",
    logoClass: "opay-logo",
  },
  {
    id: "visa",
    name: "Visa",
    description: "Visa card payment",
    logo: "VISA",
    logoClass: "visa-logo",
  },
  {
    id: "verve",
    name: "Verve",
    description: "Verve card payment",
    logo: "Verve",
    logoClass: "verve-logo",
  },
  {
    id: "google",
    name: "Google Pay",
    description: "Google Pay wallet",
    logo: "G Pay",
    logoClass: "google-logo",
  },
  {
    id: "cash",
    name: "Cash on Delivery",
    description: "Pay when your order arrives",
    logo: "COD",
    logoClass: "cash-logo",
  },
  {
    id: "transfer",
    name: "Bank Transfer",
    description: "Bank transfer demonstration",
    logo: "BANK",
    logoClass: "transfer-logo",
  },
  {
    id: "ussd",
    name: "USSD",
    description: "USSD payment demonstration",
    logo: "*",
    logoClass: "ussd-logo",
  },
];

function Checkout() {
  const { cart, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [demoCard, setDemoCard] = useState({
    cardholder: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [selectedPayment, setSelectedPayment] = useState("cash");
  const [error, setError] = useState("");
  const [paid, setPaid] = useState(false);
  const [completedTotal, setCompletedTotal] = useState(0);
  const [completedMethod, setCompletedMethod] = useState("");
  const [customerName, setCustomerName] = useState("");

  const total = cart.reduce((sum, item) => {
    const discountedPrice =
      item.price -
      (item.price * (item.discountPercentage || 0)) / 100;

    return sum + toNaira(discountedPrice) * item.quantity;
  }, 0);

  const selectedOption = paymentOptions.find(
    (option) => option.id === selectedPayment
  );

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCardChange = (e) => {
    setDemoCard({
      ...demoCard,
      [e.target.name]: e.target.value,
    });
  };

  const finishOrder = () => {
    setCompletedTotal(total);
    setCompletedMethod(selectedOption.name);
    setCustomerName(form.name);

    clearCart();
    setPaid(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.phone || !form.address) {
      setError("Please complete your delivery information.");
      return;
    }

    if (
      selectedPayment === "visa" ||
      selectedPayment === "verve"
    ) {
      if (
        !demoCard.cardholder.trim() ||
        !demoCard.cardNumber.trim() ||
        !demoCard.expiry.trim() ||
        !demoCard.cvv.trim()
      ) {
        setError("Please complete all the demo card fields.");
        return;
      }
    }

    finishOrder();
  };

  if (paid) {
    return (
      <main className="container section">
        <div className="payment-success">
          <CheckCircle size={75} color="#16a34a" />

          <p className="eyebrow">ORDER CONFIRMED</p>

          <h1>Order Placed Successfully!</h1>

          <p>
            Thank you, {customerName}! Your demonstration order
            has been completed.
          </p>

          <p>
            Payment Method: <strong>{completedMethod}</strong>
          </p>

          <p>
            Order Total: <strong>{formatNaira(completedTotal)}</strong>
          </p>

          <p className="secure-note">
            This was a simulated checkout. No payment was
            collected, sent or verified.
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
        <ArrowLeft size={18} />
        Back to cart
      </Link>

      <div className="checkout-heading">
        <p className="eyebrow">CHECKOUT</p>
        <h1>Complete Your Order</h1>
        <p>Enter your delivery information and choose a payment method.</p>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
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
            placeholder="Enter your delivery address"
            rows={4}
            required
          />

          <section className="payment-choice-section">
            <h2>Choose Payment Method</h2>

            <div className="payment-choice-grid">
              {paymentOptions.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  className={`payment-choice ${
                    selectedPayment === option.id ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedPayment(option.id);
                    setError("");
                  }}
                >
                  <span className={`payment-logo ${option.logoClass}`}>
                    {option.logo}
                  </span>

                  <span className="payment-choice-text">
                    <strong>{option.name}</strong>
                    <small>{option.description}</small>
                  </span>

                  <span className="payment-radio">
                    {selectedPayment === option.id && (
                      <CheckCircle
                        size={22}
                        fill="#ff6900"
                        color="#ff6900"
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>

            <div className="payment-selected-message">
              <strong>{selectedOption.name} selected.</strong>{" "}
              {selectedOption.description}.
            </div>
          </section>

          {(selectedPayment === "visa" ||
            selectedPayment === "verve") && (
            <section className="payment-detail-panel">
              <div className="payment-detail-heading">
                <CreditCard size={23} />
                <h3>
                  {selectedPayment === "visa"
                    ? "Visa Card Payment"
                    : "Verve Card Payment"}
                </h3>
              </div>

              <p>
                Presentation demo only. Enter fictional card
                information, not real payment credentials.
              </p>

              <label>Cardholder Name</label>
              <input
                name="cardholder"
                value={demoCard.cardholder}
                onChange={handleCardChange}
                placeholder="Enter cardholder name"
                autoComplete="off"
              />

              <label>Card Number</label>
              <input
                name="cardNumber"
                value={demoCard.cardNumber}
                onChange={handleCardChange}
                placeholder="Enter fictional card number"
                inputMode="numeric"
                autoComplete="off"
              />

              <div className="card-input-row">
                <div>
                  <label>Expiry Date</label>
                  <input
                    name="expiry"
                    value={demoCard.expiry}
                    onChange={handleCardChange}
                    placeholder="MM/YY"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label>CVV</label>
                  <input
                    name="cvv"
                    value={demoCard.cvv}
                    onChange={handleCardChange}
                    placeholder="CVV"
                    autoComplete="off"
                  />
                </div>
              </div>

              <p className="secure-note">
                <LockKeyhole size={15} />
                Demo fields only. Values are not transmitted or saved.
              </p>
            </section>
          )}

          {selectedPayment === "opay" && (
            <section className="payment-detail-panel">
              <div className="payment-detail-heading">
                <Wallet size={23} />
                <h3>OPay Wallet</h3>
              </div>

              <p>
                OPay wallet payment demonstration. No real wallet
                account is connected.
              </p>

              <label>Demo Wallet Phone Number</label>
              <input
                placeholder="Enter a fictional phone number"
                inputMode="tel"
              />
            </section>
          )}

          {selectedPayment === "google" && (
            <section className="payment-detail-panel">
              <div className="payment-detail-heading">
                <Wallet size={23} />
                <h3>Google Pay</h3>
              </div>

              <div className="demo-wallet-message">
                <span className="google-logo">G Pay</span>
                <strong>Google Pay demonstration selected</strong>
              </div>
            </section>
          )}

          {selectedPayment === "transfer" && (
            <section className="payment-detail-panel">
              <div className="payment-detail-heading">
                <Building2 size={23} />
                <h3>Bank Transfer</h3>
              </div>

              <p>
                Bank transfer demonstration. These are placeholder
                details and cannot receive money.
              </p>

              <div className="transfer-demo-details">
                <div>
                  <span>Bank</span>
                  <strong>DEMO BANK</strong>
                </div>

                <div>
                  <span>Account Name</span>
                  <strong>DEMO STORE</strong>
                </div>

                <div>
                  <span>Account Number</span>
                  <strong>DEMO ONLY — NOT REAL</strong>
                </div>

                <div>
                  <span>Amount</span>
                  <strong>{formatNaira(total)}</strong>
                </div>

                <div>
                  <span>Reference</span>
                  <strong>DEMO-TRANSFER</strong>
                </div>
              </div>

              <p className="secure-note">
                No actual bank transfer is made or verified.
              </p>
            </section>
          )}

          {selectedPayment === "ussd" && (
            <section className="payment-detail-panel">
              <div className="payment-detail-heading">
                <Smartphone size={23} />
                <h3>USSD Payment</h3>
              </div>

              <p>
                USSD payment demonstration. No real USSD code
                is generated or dialled.
              </p>

              <div className="ussd-demo-display">
                <span>USSD DEMONSTRATION</span>
                <strong>{formatNaira(total)}</strong>
                <small>Simulation only — do not dial</small>
              </div>
            </section>
          )}

          {selectedPayment === "cash" && (
            <section className="payment-detail-panel">
              <div className="payment-detail-heading">
                <ShoppingBag size={23} />
                <h3>Cash on Delivery</h3>
              </div>

              <div className="cash-delivery-message">
                <CheckCircle size={20} />
                Cash on Delivery selected. Pay when your order arrives.
              </div>
            </section>
          )}

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="primary-btn checkout-submit"
          >
            Confirm Demo Order — {formatNaira(total)}
          </button>

          <p className="secure-note">
            <LockKeyhole size={15} />
            Frontend demonstration only. No real payment is processed.
          </p>
        </form>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>

          {cart.map((item) => {
            const discountedPrice =
              item.price -
              (item.price * (item.discountPercentage || 0)) / 100;

            return (
              <div className="checkout-product" key={item.id}>
                <img src={item.thumbnail} alt={item.title} />

                <div>
                  <strong>{item.title}</strong>
                  <p>Quantity: {item.quantity}</p>
                </div>

                <span>
                  {formatNaira(
                    toNaira(discountedPrice) * item.quantity
                  )}
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
