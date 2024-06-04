const express = require("express");
const router = express.Router();

const {
  getUsersNumber,
  getStocksNumber,
} = require("../Controllers/AnalyticController");

const analyticRoutes = (db) => {
  // Funzione per ottenere tutti i prodotti dal database
  router.get("/GetUsersNumber", (req, res) => {
    getUsersNumber(res, db);
  });

  router.get("/GetStocksNumber", (req, res) => {
    getStocksNumber(res, db);
  });
  return router;
};

module.exports = analyticRoutes;
