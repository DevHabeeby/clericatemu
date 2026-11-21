
export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Only POST requests are allowed.",
    });
  }

  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return res.status(500).json({
        success: false,
        message: "Paystack secret key is missing in Vercel settings.",
      });
    }

    const { email, amount } = req.body || {};

    if (!email || !amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email and amount.",
      });
    }

    const origin =
      req.headers.origin ||
      `https://${process.env.VERCEL_URL}`;

    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: Math.round(Number(amount) * 100),
          currency: "NGN",
          callback_url: `${origin}/checkout`,
        }),
      }
    );

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData.status) {
      return res.status(400).json({
        success: false,
        message:
          paystackData.message ||
          "Paystack could not initialize payment.",
      });
    }

    return res.status(200).json({
      success: true,
      authorization_url: paystackData.data.authorization_url,
      reference: paystackData.data.reference,
    });
  } catch (error) {
    console.error("Paystack initialization error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment server error. Please try again.",
    });
  }
}
