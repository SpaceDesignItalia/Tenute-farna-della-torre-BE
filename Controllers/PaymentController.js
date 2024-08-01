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
  const { products } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "paypal"],
      line_items: products.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.productName,
          },
          unit_amount: item.unitPrice * 100,
        },
        quantity: item.amount,
      })),
      mode: "payment",
      success_url:
        "http://localhost:5173/order-confirmed/" +
        req.session.customer.id +
        "/{CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/dashboard/orders?redirected=true",
      customer_email: req.session.customer.email,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getCheckoutDetails = async (req, res) => {
  const { idPayment } = req.query; // Assume che l'id della sessione venga passato come parametro nella URL
  try {
    const session = await stripe.checkout.sessions.retrieve(idPayment);

    if (session.payment_status == "unpaid") {
      res.json(session);
    } else {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        session.payment_intent
      );
      const latestChargeId = paymentIntent.latest_charge;
      const charge = await stripe.charges.retrieve(latestChargeId);

      res.json(charge);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const resumeCheckoutSession = async (req, res) => {
  const { sessionId } = req.body; // L'ID della sessione di checkout salvata

  try {
    // Recupera la sessione di checkout salvata
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verifica se la sessione esiste e ha un stato valido
    if (session && session.payment_status !== "paid") {
      // In questo esempio, se la sessione non è stata pagata, puoi reindirizzare l'utente
      // al checkout con i dati della sessione esistente
      res.json({
        id: session.id,
        url: session.url,
      });
    } else {
      res
        .status(404)
        .json({ error: "Sessione di checkout non trovata o già completata." });
    }
  } catch (error) {
    console.error("Errore nel recupero della sessione di checkout:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPaymentConfig,
  createCheckoutSession,
  getCheckoutDetails,
  resumeCheckoutSession,
};
