const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const authenticateMiddleware = require("../middlewares/Authmiddleware");

const {
  getPaymentConfig,
  createCheckoutSession,
  getCheckoutDetails,
  resumeCheckoutSession,
} = require("../Controllers/PaymentController");
const paymentsRoutes = (db) => {
  // Funzioni per ottenere i dati delgli utenti

  router.get("/GetPaymentConfig", (req, res) => {
    getPaymentConfig(req, res);
  });

  router.post("/CreateCheckoutSession", (req, res) => {
    createCheckoutSession(req, res, db);
  });

  router.get("/GetCheckoutDetails", async (req, res) => {
    getCheckoutDetails(req, res);
  });

  router.post("/ResumeCheckoutSession", async (req, res) => {
    resumeCheckoutSession(req, res);
  });
  return router;
};

module.exports = paymentsRoutes;
