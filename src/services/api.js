const API_URL = "https://dummyjson.com";

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products?limit=100`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};

export const getProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error("Product not found");
  }

  return response.json();
};

export const searchProducts = async (query) => {
  const response = await fetch(
    `${API_URL}/products/search?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Search failed");
  }

  return response.json();
};

export const getCategories = async () => {
  const response = await fetch(`${API_URL}/products/category-list`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
};

export const getCategoryProducts = async (category) => {
  const response = await fetch(
    `${API_URL}/products/category/${encodeURIComponent(category)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch category products");
  }

  return response.json();
};