
export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Only GET requests are allowed.",
    });
  }

  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    const reference = req.query.reference;

    if (!secretKey) {
      return res.status(500).json({
        success: false,
        message: "Paystack secret key is missing.",
      });
    }

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is missing.",
      });
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (
      !response.ok ||
      !data.status ||
      data.data.status !== "success"
    ) {
      return res.status(400).json({
        success: false,
        message: data.message || "Payment could not be verified.",
      });
    }

    return res.status(200).json({
      success: true,
      verified: true,
      reference: data.data.reference,
      status: data.data.status,
    });
  } catch (error) {
    console.error("Paystack verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify payment right now.",
    });
  }
}
