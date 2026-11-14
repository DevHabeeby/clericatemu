
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Star, Truck } from "lucide-react";
import { getProduct } from "../services/api";
import { useCart } from "../context/CartContext";
import { formatNaira, toNaira } from "../utils/currency";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError("");

    getProduct(id)
      .then((data) => {
        if (active) setProduct(data);
      })
      .catch(() => {
        if (active) setError("Product could not be found.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <p className="status-message">Loading product...</p>;
  }

  if (error || !product) {
    return (
      <p className="error-message">
        {error || "Product not found."}
      </p>
    );
  }

  const price =
    product.price -
    (product.price * product.discountPercentage) / 100;

  return (
    <main className="container section">
      <Link to="/products" className="back-link">
        <ArrowLeft size={18} /> Back to products
      </Link>

      <div className="details-layout">
        <div className="details-image">
          <img src={product.thumbnail} alt={product.title} />
        </div>

        <div className="details-info">
          <p className="eyebrow">{product.category}</p>

          <h1>{product.title}</h1>

          <div className="rating">
            <Star size={18} fill="#ffad00" color="#ffad00" />
            {product.rating} / 5
          </div>

          <p className="details-description">
            {product.description}
          </p>

          <div className="details-price">
            <strong>{formatNaira(toNaira(price))}</strong>
            <del>{formatNaira(toNaira(product.price))}</del>
            <span>
              {Math.round(product.discountPercentage)}% OFF
            </span>
          </div>

          <p className="stock">
            {product.stock > 0
              ? `${product.stock} items in sample stock`
              : "Out of stock"}
          </p>

          <button
            className="primary-btn"
            disabled={product.stock <= 0}
            onClick={() => addToCart(product)}
          >
            <ShoppingCart size={20} /> Add to Cart
          </button>

          <div className="shipping-info">
            <Truck size={20} />
            <div>
              <strong>Shipping information</strong>
              <p>{product.shippingInformation}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;
