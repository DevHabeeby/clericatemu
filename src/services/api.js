
const API_URL = "https://fakestoreapi.com";

// Convert Fake Store API products into your Temu product format
const formatProduct = (product) => ({
  ...product,
  thumbnail: product.image,
  images: [product.image],
  discountPercentage: 0,
  rating: product.rating?.rate ?? 0,
  category: product.category,
});

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();

  return {
    products: data.map(formatProduct),
  };
};

export const getProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error("Product not found");
  }

  const data = await response.json();

  return formatProduct(data);
};

export const searchProducts = async (query) => {
  const data = await getProducts();

  const filteredProducts = data.products.filter((product) =>
    product.title.toLowerCase().includes(query.toLowerCase())
  );

  return {
    products: filteredProducts,
  };
};

export const getCategories = async () => {
  const response = await fetch(`${API_URL}/products/categories`);

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

  const data = await response.json();

  return {
    products: data.map(formatProduct),
  };
};
