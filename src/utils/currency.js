const NGN_PER_USD = Number(
  import.meta.env.VITE_NGN_PER_USD || 1500
);

export const toNaira = (usdPrice) =>
  Math.round(Number(usdPrice) * NGN_PER_USD);

export const formatNaira = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);