
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import crypto from "node:crypto";

dotenv.config({ path: "server/.env" });

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5174";
const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const NGN_PER_USD = Number(process.env.NGN_PER_USD);

if (!SECRET_KEY || !SECRET_KEY.startsWith("sk_test_")) {
  throw new Error("A valid Paystack test secret key is required.");
}

if (!Number.isFinite(NGN_PER_USD) || NGN_PER_USD <= 0) {
  throw new Error("NGN_PER_USD must be a positive number.");
}

app.use(helmet());
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const pendingOrders = new Map();

const paystackRequest = async (endpoint, options = {}) => {
  const response = await fetch(
    `https://api.paystack.co${endpoint}`,
    {
      ...options,
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    }
  );

  const result = await response.json();

  if (!response.ok || !result.status) {
    throw new Error(result.message || "Paystack request failed");
  }

  return result.data;
};

// Calculate the order from trusted API product data.
async function calculateOrder(items) {
  if (
    !Array.isArray(items) ||
    items.length === 0 ||
    items.length > 30
  ) {
    throw new Error("Invalid cart items.");
  }

  let total = 0;
  const verifiedItems = [];

  for (const item of items) {
    const id = Number(item.id);
    const quantity = Number(item.quantity);

    if (
      !Number.isInteger(id) ||
      id < 1 ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 20
    ) {
      throw new Error("Invalid product or quantity.");
    }

    const response = await fetch(
      `https://dummyjson.com/products/${id}`
    );

    if (!response.ok) {
      throw new Error("Unable to verify a product.");
    }

    const product = await response.json();

    // Demo conversion: sample API USD prices to NGN.
    const unitPrice = Math.round(
      product.price * NGN_PER_USD
    );

    total += unitPrice * quantity;

    verifiedItems.push({
      id: product.id,
      title: product.title,
      quantity,
      unitPrice,
    });
  }

  if (!Number.isSafeInteger(total) || total < 50) {
    throw new Error("Order total must be at least ₦50.");
  }

  return {
    items: verifiedItems,
    total,
    amount: total * 100,
  };
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "Cleric A. payment server is running.",
  });
});

// Initialize payment
app.post(
  "/api/payments/initialize",
  paymentLimiter,
  async (req, res) => {
    try {
      const { email, items, customer } = req.body;

      if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ) {
        return res.status(400).json({
          message: "Please provide a valid email address.",
        });
      }

      const name = String(customer?.name || "").trim();
      const phone = String(customer?.phone || "").trim();
      const address = String(customer?.address || "").trim();

      if (
        name.length < 2 ||
        name.length > 100 ||
        phone.length < 7 ||
        phone.length > 25 ||
        address.length < 5 ||
        address.length > 300
      ) {
        return res.status(400).json({
          message: "Please provide valid delivery details.",
        });
      }

      const order = await calculateOrder(items);

      const payment = await paystackRequest(
        "/transaction/initialize",
        {
          method: "POST",
          body: JSON.stringify({
            email,
            amount: order.amount,
            currency: "NGN",
            channels: ["card", "bank_transfer"],
            callback_url: `${CLIENT_URL}/payment-success`,
            metadata: {
              custom_fields: [
                {
                  display_name: "Customer Name",
                  variable_name: "customer_name",
                  value: name,
                },
                {
                  display_name: "Phone Number",
                  variable_name: "phone",
                  value: phone,
                },
                {
                  display_name: "Delivery Address",
                  variable_name: "delivery_address",
                  value: address,
                },
              ],
            },
          }),
        }
      );

      pendingOrders.set(payment.reference, {
        ...order,
        email,
        customer: { name, phone, address },
        paid: false,
      });

      return res.json({
        status: "success",
        authorization_url: payment.authorization_url,
        reference: payment.reference,
        total: order.total,
      });
    } catch (error) {
      console.error("Payment initialization:", error.message);

      return res.status(400).json({
        message: error.message || "Unable to initialize payment.",
      });
    }
  }
);

// Verify payment
app.post(
  "/api/payments/verify",
  paymentLimiter,
  async (req, res) => {
    try {
      const reference = req.body.reference;

      if (
        typeof reference !== "string" ||
        !/^[a-zA-Z0-9.=_-]{1,100}$/.test(reference)
      ) {
        return res.status(400).json({
          message: "Invalid payment reference.",
        });
      }

      const order = pendingOrders.get(reference);

      if (!order) {
        return res.status(404).json({
          message: "Order not found. Please restart checkout.",
        });
      }

      if (order.paid) {
        return res.json({
          status: "success",
          message: "Payment already verified.",
          amount: order.total,
        });
      }

      const transaction = await paystackRequest(
        `/transaction/verify/${encodeURIComponent(reference)}`
      );

      if (
        transaction.status !== "success" ||
        transaction.currency !== "NGN" ||
        transaction.amount !== order.amount
      ) {
        return res.status(400).json({
          status: transaction.status,
          message: "Payment is not yet confirmed.",
        });
      }

      order.paid = true;
      pendingOrders.set(reference, order);

      return res.json({
        status: "success",
        message: "Payment successfully verified.",
        amount: order.total,
        items: order.items,
        customer: order.customer,
      });
    } catch (error) {
      console.error("Payment verification:", error.message);

      return res.status(500).json({
        message: "Unable to verify payment. Please try again.",
      });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Cleric A. payment server running on port ${PORT}`);
});
