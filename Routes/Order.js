const express = require("express");
const router = express.Router();

const { getAllOrders } = require("../Controllers/OrderController");
const { getOrderById } = require("../Controllers/OrderController");
const { getOrdersByIdCustomer } = require("../Controllers/OrderController");
const { getProductsByIdOrder } = require("../Controllers/OrderController");
const { deleteOrder } = require("../Controllers/OrderController");

const orderRoutes = (db) => {
  router.get("/GetAllOrders", (req, res) => {
    getAllOrders(req, res, db);
  });

  router.get("/GetOrderById", (req, res) => {
    getOrderById(req, res, db);
  });

  router.get("/GetOrdersByIdCustomer", (req, res) => {
    getOrdersByIdCustomer(req, res, db);
  });

  router.get("/GetProductsByIdOrder", (req, res) => {
    getProductsByIdOrder(req, res, db);
  });

  router.delete("/DeleteOrder", (req, res) => {
    deleteOrder(req, res, db);
  });

  return router;
};

module.exports = orderRoutes;
