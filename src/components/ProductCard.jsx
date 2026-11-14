
import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatNaira, toNaira } from "../utils/currency";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const discountedPrice =
    product.price -
    (product.price * product.discountPercentage) / 100;

  return (
    <div className="product-card">
      <Link
        to={`/products/${product.id}`}
        className="product-image"
      >
        <img src={product.thumbnail} alt={product.title} />

        <span className="discount-badge">
          -{Math.round(product.discountPercentage)}%
        </span>
      </Link>

      <div className="product-info">
        <Link to={`/products/${product.id}`}>
          <h3>{product.title}</h3>
        </Link>

        <div className="rating">
          <Star size={15} fill="#ffad00" color="#ffad00" />
          <span>{product.rating}</span>
        </div>

        <div className="product-bottom">
          <div>
            <strong>
              {formatNaira(toNaira(discountedPrice))}
            </strong>
            <del>
              {formatNaira(toNaira(product.price))}
            </del>
          </div>

          <button
            className="add-cart-btn"
            onClick={() => addToCart(product)}
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingCart size={19} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
