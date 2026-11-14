import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, Headphones } from "lucide-react";
import { getProducts, getCategories } from "../services/api";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHome = async () => {
      try {
        const [productData, categoryData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        setProducts(productData.products);
        setCategories(categoryData);
      } catch {
        setError("Unable to load products. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    loadHome();
  }, []);

  return (
    <main>
      <section className="hero container">
        <div className="hero-content">
          <span className="hero-tag">EVERYDAY GREAT DEALS</span>

          <h1>
            Discover More.
            <br />
            <span>Spend Less.</span>
          </h1>

          <p>
            Find amazing products for your everyday needs.
            Explore our collection and enjoy great deals.
          </p>

          <Link to="/products" className="hero-btn">
            Shop Now <ArrowRight size={19} />
          </Link>

          <div className="hero-features">
            <span><Truck size={17} /> Great deals</span>
            <span><ShieldCheck size={17} /> Secure demo</span>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=900"
            alt="Shopping bags and gifts"
          />
          <div className="floating-card">
            <strong>Discover deals!</strong>
            <p>Find something you love.</p>
          </div>
        </div>
      </section>

      <section className="benefits container">
        <div>
          <Truck />
          <span>Great shopping deals</span>
        </div>
        <div>
          <ShieldCheck />
          <span>Safe demo shopping</span>
        </div>
        <div>
          <Headphones />
          <span>Customer support concept</span>
        </div>
      </section>

      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EXPLORE</p>
            <h2>Shop by Category</h2>
          </div>

          <Link to="/products">View all <ArrowRight size={17} /></Link>
        </div>

        <div className="category-list">
          {categories.slice(0, 10).map((category) => (
            <Link
              key={category}
              to={`/products?category=${category}`}
              className="category-item"
            >
              <span>{category.replaceAll("-", " ")}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">HANDPICKED FOR YOU</p>
            <h2>Popular Products</h2>
          </div>

          <Link to="/products">See all <ArrowRight size={17} /></Link>
        </div>

        {loading ? (
          <p className="status-message">Loading products...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="product-grid">
            {products.slice(0, 12).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;