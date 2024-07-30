const express = require("express");
const router = express.Router();

const { getOrdersByIdCustomer } = require("../Controllers/OrderController");

const orderRoutes = (db) => {
  router.get("/GetOrdersByIdCustomer", (req, res) => {
    getOrdersByIdCustomer(req, res, db);
  });

  return router;
};

module.exports = orderRoutes;
