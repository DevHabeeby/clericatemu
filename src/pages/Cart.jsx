
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatNaira, toNaira } from "../utils/currency";

function Cart() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } =
    useCart();

  // Calculate the total price of all products in Naira
  const totalNaira = cart.reduce((total, item) => {
  const discountedPrice =
    item.price -
    (item.price * item.discountPercentage) / 100;

  return total + toNaira(discountedPrice) * item.quantity;
}, 0);

  // If the cart is empty
  if (cart.length === 0) {
    return (
      <main className="container section empty-cart">
        <ShoppingBag size={60} />
        <h2>Your cart is empty</h2>
        <p>You haven't added any products to your cart yet.</p>

        <Link to="/products" className="primary-btn">
          Start Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="container section cart-page">
      <div className="cart-heading">
        <div>
          <p className="eyebrow">YOUR SHOPPING BAG</p>
          <h1>Shopping Cart</h1>
          <p>
            You have {cart.length} product
            {cart.length > 1 ? "s" : ""} in your cart.
          </p>
        </div>

        <Link to="/products" className="back-link">
          <ArrowLeft size={18} />
          Continue Shopping
        </Link>
      </div>

      <div className="cart-layout">
        <section className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img
                src={item.thumbnail}
                alt={item.title}
                className="cart-product-image"
              />

              <div className="cart-product-info">
                <h3>{item.title}</h3>

               <p className="cart-price">
  {formatNaira(
    toNaira(
      item.price -
      (item.price * item.discountPercentage) / 100
    )
  )}
</p>

                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(item.id)}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() => increaseQuantity(item.id)}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="cart-item-actions">
                <strong>
  {formatNaira(
    toNaira(
      item.price -
      (item.price * item.discountPercentage) / 100
    ) * item.quantity
  )}
</strong>

                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.title} from cart`}
                >
                  <Trash2 size={18} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </section>

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{formatNaira(totalNaira)}</strong>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <strong>Free</strong>
          </div>

          <div className="summary-row total-row">
            <span>Total</span>
            <strong>{formatNaira(totalNaira)}</strong>
          </div>

          <Link
            to="/checkout"
            className="primary-btn checkout-btn"
          >
            Proceed to Checkout
          </Link>

          <p className="secure-note">
            Your order will be processed through secure checkout.
          </p>
        </aside>
      </div>
    </main>
  );
}

export default Cart;
