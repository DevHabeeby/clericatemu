
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  getProducts,
  getCategories,
  getCategoryProducts,
  searchProducts,
} from "../services/api";

import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();

        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Category error:", error);
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  // Load products
  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      setLoading(true);
      setError("");

      try {
        let data;

        if (search.trim()) {
          data = await searchProducts(search.trim());
        } else if (category) {
          data = await getCategoryProducts(category);
        } else {
          data = await getProducts();
        }

        console.log("Products API response:", data);

        if (active) {
          if (Array.isArray(data.products)) {
            setProducts(data.products);
          } else {
            setProducts([]);
            setError("Products data was not returned correctly.");
          }
        }
      } catch (error) {
        console.error("Product loading error:", error);

        if (active) {
          setProducts([]);
          setError(
            "Could not load products. Please check your internet connection and try again."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, [search, category]);

  // Change category
  const changeCategory = (value) => {
    const params = new URLSearchParams(searchParams);

    params.delete("search");

    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }

    setSearchParams(params);
  };

  return (
    <main className="container section products-page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">FIND YOUR FAVOURITES</p>

          <h2>
            {search
              ? `Search: ${search}`
              : category
                ? category.replaceAll("-", " ")
                : "All Products"}
          </h2>
        </div>

        <span>
          {loading ? "Loading..." : `${products.length} products`}
        </span>
      </div>

      <div className="filter-bar">
        <label htmlFor="category">Category:</label>

        <select
          id="category"
          value={category}
          onChange={(event) => changeCategory(event.target.value)}
        >
          <option value="">All Categories</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item.replaceAll("-", " ")}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="status-message">Loading products...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : products.length === 0 ? (
        <p className="status-message">No products found.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default Products;
