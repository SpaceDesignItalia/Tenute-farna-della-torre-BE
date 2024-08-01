const express = require("express");
const router = express.Router();

const {
  addToCart,
  getProductsByIdCustomer,
  checkStock,
  updateAmount,
  removeProduct,
  completeOrder,
  getCartItemNumber,
  getOrderByIdCustomerAndPaymentId,
} = require("../Controllers/CartController");

const cartRoutes = (db) => {
  router.post("/AddToCart", (req, res) => {
    addToCart(req, res, db);
  });

  router.get("/GetCartItemNumber", (req, res) => {
    getCartItemNumber(req, res, db);
  });

  router.get("/CheckStocks", (req, res) => {
    checkStock(req, res, db);
  });
  router.get("/GetOrderByIdCustomerAndPaymentId", (req, res) => {
    getOrderByIdCustomerAndPaymentId(req, res, db);
  });
  router.get("/GetProductsByIdCustomer", (req, res) => {
    getProductsByIdCustomer(req, res, db);
  });

  router.post("/UpdateAmount", (req, res) => {
    updateAmount(req, res, db);
  });

  router.post("/RemoveProduct", (req, res) => {
    removeProduct(req, res, db);
  });

  router.post("/CompleteOrder", (req, res) => {
    completeOrder(req, res, db);
  });

  return router;
};

module.exports = cartRoutes;
