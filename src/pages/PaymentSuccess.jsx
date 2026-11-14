
import { Link, useLocation } from "react-router-dom";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { formatNaira } from "../utils/currency";

function PaymentSuccess() {
  const location = useLocation();

  const receipt = location.state;

  // If someone opens this page directly,
  // there may be no demo receipt.
  if (!receipt) {
    return (
      <main className="container section payment-result">
        <h1>No demo order found</h1>

        <p>
          Please add products to your cart and complete
          the demo checkout first.
        </p>

        <Link to="/products" className="primary-btn">
          Browse Products
        </Link>
      </main>
    );
  }

  return (
    <main className="container section payment-result">
      <div className="result-icon success-icon">
        <CheckCircle size={55} />
      </div>

      <p className="eyebrow">DEMO PAYMENT COMPLETE</p>

      <h1>Payment Successful!</h1>

      <p>
        Thank you, {receipt.name}! Your demo order
        has been completed successfully.
      </p>

      <div className="paid-amount">
        {formatNaira(receipt.total)}
      </div>

      <p className="secure-note">
        This was a simulated payment. No real money
        was charged.
      </p>

      <Link to="/" className="primary-btn">
        <ShoppingBag size={18} />
        Continue Shopping
      </Link>
    </main>
  );
}

export default PaymentSuccess;
