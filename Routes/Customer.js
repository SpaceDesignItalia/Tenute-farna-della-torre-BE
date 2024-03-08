const express = require("express");
const router = express.Router();

const {
  getAll,
  getCustomerById,
  getImagesByCustomerId,
  getCustomersNumber,
  login,
  register,
  updateCustomerStatus,
  GetCustomerData,
  CheckSession,
  logout,
  updateCustomerData,
  updateCustomerPassword,
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

  // Funzione per effettuare il logout
  router.get("/Logout", async (req, res) => {
    logout(req, res); // Collega la funzione di logout alla route
  });

  // Funzione per effettuare il login
  router.post("/Login", async (req, res) => {
    login(req, res, db);
  });

  router.post("/Register", async (req, res) => {
    register(req, res, db);
  });

  // Funzione per aggiornare lo status del Cliente
  router.put("/UpdateCustomerData", async (req, res) => {
    updateCustomerData(req, res, db);
  });

  router.put("/UpdateCustomerPassword", async (req, res) => {
    updateCustomerPassword(req, res, db);
  });

  router.put("/UpdateStatus/:id", async (req, res) => {
    updateCustomerStatus(req, res, db);
  });
  return router;
};

module.exports = customerRoutes;
