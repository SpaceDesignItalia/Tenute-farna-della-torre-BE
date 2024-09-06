const express = require("express");
const router = express.Router();

const {
  getOrderDataByIdCustomerAndPaymentId,
  getAllOrders,
  getAllOrdersData,
  getOrderById,
  getOrdersByIdCustomer,
  getProductsByIdOrder,
  setTrakingLink,
  deleteOrder,
} = require("../Controllers/OrderController");
const { updateShippingLink } = require("../Controllers/OrderController");

const orderRoutes = (db) => {
  router.put("/SetTrakingLink", (req, res) => {
    setTrakingLink(req, res, db);
  });

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

  router.get("/GetOrderDataByIdCustomerAndPaymentId", (req, res) => {
    getOrderDataByIdCustomerAndPaymentId(req, res, db);
  });

  router.put("/UpdateShippingLink", (req, res) => {
    updateShippingLink(req, res, db);
  });

  return router;
};

module.exports = orderRoutes;
