// paymentController.js

const stripe = require("stripe")(
  "sk_test_51Pgiq2IscqRNssazX9PTk3Hersuvd2DgYsVcIPCJIboizbzREk7buTDHc7YXmww84Lpqg0JOpeozOhCPTkLYFDBF00iagK7dEt"
);

const getPaymentConfig = async (req, res) => {
  try {
    res.status(200).send({
      publishableKey:
        "pk_test_51Pgiq2IscqRNssazieLjmRsSp8oD7utDeEhb3Ck8Wswjdm2S4HYDquGdRssC0mBx9KmB4p6ljnsafZ4w2T9uSTwD00IyUKaecX",
    });
  } catch (error) {
    console.error("Errore l'ottenimento della chiave:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

const createCheckoutSession = async (req, res) => {
  const { items } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "paypal"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url:
        "http://localhost:5173/order-confirmed?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/checkout",
      customer_email: req.session.customer.email,
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPaymentIntentData = async (req, res) => {
  const id = req.query.PaymentId;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(id);
    const latestChargeId = paymentIntent.latest_charge;
    const charge = await stripe.charges.retrieve(latestChargeId);
    res.send(charge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPaymentConfig,
  createCheckoutSession,
  getPaymentIntentData,
};
