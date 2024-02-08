const express = require("express");
const router = express.Router();

const {
  login,
  GetCustomerData,
  CheckSession,
} = require("../Controllers/CustomerController");

const customerRoutes = (db) => {
  // Funzione per ottenere tutti i prodotti dal database

  router.get("/CheckSession", async (req, res) => {
    CheckSession(req, res);
  });

  router.get("/GetCustomerData", async (req, res) => {
    GetCustomerData(req, res, db);
  });

  // Funzione per effettuare il login
  router.post("/Login", async (req, res) => {
    login(req, res, db);
  });
  return router;
};

module.exports = customerRoutes;
