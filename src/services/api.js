
const API_URL = "https://dummyjson.com";

// Keep product data compatible with your existing product cards and cart
const formatProduct = (product) => ({
  ...product,
  thumbnail: product.thumbnail || product.images?.[0] || "",
  images: product.images || [],
  discountPercentage: product.discountPercentage ?? 0,
  rating: product.rating ?? 0,
  category: product.category || "",
});

// Get all products
export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products?limit=0`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();

  return {
    products: data.products.map(formatProduct),
    total: data.total,
  };
};

// Get one product
export const getProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error("Product not found");
  }

  const data = await response.json();

  return formatProduct(data);
};

// Search products
export const searchProducts = async (query) => {
  const response = await fetch(
    `${API_URL}/products/search?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Failed to search products");
  }

  const data = await response.json();

  return {
    products: data.products.map(formatProduct),
    total: data.total,
  };
};

// Get product categories
export const getCategories = async () => {
  const response = await fetch(`${API_URL}/products/category-list`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
};

// Get products by category
export const getCategoryProducts = async (category) => {
  const categoryMap = {
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

  const selectedCategories = categoryMap[category] || [category];

  const responses = await Promise.all(
    selectedCategories.map(async (apiCategory) => {
      const response = await fetch(
        `${API_URL}/products/category/${encodeURIComponent(apiCategory)}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch ${apiCategory} products`);
      }

      const data = await response.json();

      return data.products.map(formatProduct);
    })
  );

  // Combine all products from the selected categories
  const products = responses.flat();

  return {
    products,
    total: products.length,
  };
};
