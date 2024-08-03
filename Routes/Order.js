const express = require("express");
const router = express.Router();

const {
  getOrdersByIdCustomer,
  getOrderByIdCustomerAndPaymentId,
  getOrderDataByIdCustomerAndPaymentId,
} = require("../Controllers/OrderController");

const orderRoutes = (db) => {
  router.get("/GetOrdersByIdCustomer", (req, res) => {
    getOrdersByIdCustomer(req, res, db);
  });

  router.get("/GetOrderByIdCustomerAndPaymentId", (req, res) => {
    getOrderByIdCustomerAndPaymentId(req, res, db);
  });

  router.get("/GetOrderDataByIdCustomerAndPaymentId", (req, res) => {
    getOrderDataByIdCustomerAndPaymentId(req, res, db);
  });

  return router;
};

module.exports = orderRoutes;
