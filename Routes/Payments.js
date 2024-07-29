const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const authenticateMiddleware = require("../middlewares/Authmiddleware");

const {
  getPaymentConfig,
  createCheckoutSession,
  getPaymentIntentData,
} = require("../Controllers/PaymentController");
const paymentsRoutes = (db) => {
  // Funzioni per ottenere i dati delgli utenti

  router.get("/GetPaymentConfig", (req, res) => {
    getPaymentConfig(req, res);
  });

  router.post("/CreateCheckoutSession", (req, res) => {
    createCheckoutSession(req, res);
  });

  router.get("/GetPaymentIntentData", async (req, res) => {
    getPaymentIntentData(req, res);
  });
  return router;
};

module.exports = paymentsRoutes;
