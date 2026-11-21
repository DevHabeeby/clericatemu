
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  getProducts,
  getCategoryProducts,
  searchProducts,
} from "../services/api";

import ProductCard from "../components/ProductCard";

// Main navigation categories mapped to DummyJSON categories
const categoryMapping = {
  electronics: [
    "smartphones",
    "laptops",
    "tablets",
    "mobile-accessories",
  ],

  beauty: [
    "beauty",
    "fragrances",
    "skin-care",
  ],

  fashion: [
    "tops",
    "mens-shirts",
    "mens-shoes",
    "mens-watches",
    "womens-dresses",
    "womens-shoes",
    "womens-watches",
    "womens-bags",
    "womens-jewellery",
  ],

  "home-living": [
    "furniture",
    "home-decoration",
    "kitchen-accessories",
  ],
};

// Convert category names to a consistent format
function normalizeCategory(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-");
}

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] =
    useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  // Load products
  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      setLoading(true);
      setError("");

      try {
        let data;

        if (search.trim()) {
          // Search products
          data = await searchProducts(search.trim());

          if (active) {
            setProducts(data.products || []);
          }
        } else if (category) {
          // Normalize category from navbar or URL
          const normalizedCategory =
            normalizeCategory(category);

          // Find matching API categories
          const mappedCategories =
            categoryMapping[normalizedCategory];

          if (mappedCategories) {
            // Fetch products from every category in the group
            const responses = await Promise.all(
              mappedCategories.map((apiCategory) =>
                getCategoryProducts(apiCategory)
              )
            );

            const combinedProducts = responses.flatMap(
              (response) => response.products || []
            );

            // Remove duplicate products
            const uniqueProducts = [
              ...new Map(
                combinedProducts.map((product) => [
                  product.id,
                  product,
                ])
              ).values(),
            ];

            if (active) {
              setProducts(uniqueProducts);
            }
          } else {
            // If it's already an API category, use it directly
            data = await getCategoryProducts(
              normalizedCategory
            );

            if (active) {
              setProducts(data.products || []);
            }
          }
        } else {
          // Load all products
          data = await getProducts();

          if (active) {
            setProducts(data.products || []);
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
          <p className="eyebrow">
            FIND YOUR FAVOURITES
          </p>

          <h2>
            {search
              ? `Search: ${search}`
              : category
                ? category.replaceAll("-", " ")
                : "All Products"}
          </h2>
        </div>

        <span>
          {loading
            ? "Loading..."
            : `${products.length} products`}
        </span>
      </div>

      {/* Category filter */}
      <div className="filter-bar">
        <label htmlFor="category">
          Category:
        </label>

        <select
          id="category"
          value={category}
          onChange={(event) =>
            changeCategory(event.target.value)
          }
        >
          <option value="">
            All Categories
          </option>

          <option value="electronics">
            Electronics
          </option>

          <option value="beauty">
            Beauty
          </option>

          <option value="fashion">
            Fashion
          </option>

          <option value="home-living">
            Home & Living
          </option>
        </select>
      </div>

      {/* Product results */}
      {loading ? (
        <p className="status-message">
          Loading products...
        </p>
      ) : error ? (
        <p className="error-message">
          {error}
        </p>
      ) : products.length === 0 ? (
        <p className="status-message">
          No products found.
        </p>
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
