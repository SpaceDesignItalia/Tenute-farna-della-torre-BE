const express = require("express");
const router = express.Router();

const {
  getAll,
  getCustomerById,
  getImagesByCustomerId,
  getCustomersNumber,
  login,
  updateCustomerStatus,
  GetCustomerData,
  CheckSession,
  SendOTP,
  checkOTP,
} = require("../Controllers/CustomerController");

const customerRoutes = (db) => {
  // Funzione per ottenere tutti i prodotti dal database
  router.get("/GetAll", (req, res) => {
    getAll(req, res, db);
  });

  router.get("/GetCustomerById/:id", (req, res) => {
    getCustomerById(req, res, db);
  });

  router.get("/GetImagesByCustomerId/:id", (req, res) => {
    getImagesByCustomerId(req, res, db);
  });

  router.get("/GetCustomersNumber", (req, res) => {
    getCustomersNumber(res, db);
  });

  router.get("/CheckSession", async (req, res) => {
    CheckSession(req, res);
  });

  router.get("/GetCustomerData", async (req, res) => {
    GetCustomerData(req, res, db);
  });

  router.get("/CheckOTP/:token", async (req, res) => {
    checkOTP(req, res, db);
  });

  // Funzione per effettuare il login
  router.post("/Login", async (req, res) => {
    login(req, res, db);
  });

  router.post("/StartRecoverPass", async (req, res) => {
    SendOTP(req, res, db);
  });

  // Funzione per aggiornare lo status del Cliente
  router.put("/UpdateStatus/:id", async (req, res) => {
    updateCustomerStatus(req, res, db);
  });
  return router;
};

module.exports = customerRoutes;
