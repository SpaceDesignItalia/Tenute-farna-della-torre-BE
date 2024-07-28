const express = require("express");
const router = express.Router();

const {
  addToCart,
  getProductsByIdCustomer,
  increaseAmount,
  decreaseAmount,
  removeProduct,
} = require("../Controllers/CartController");

const cartRoutes = (db) => {
  router.post("/AddToCart", (req, res) => {
    addToCart(req, res, db);
  });

  router.get("/GetProductsByIdCustomer", (req, res) => {
    getProductsByIdCustomer(req, res, db);
  });

  router.post("/IncreaseAmount", (req, res) => {
    increaseAmount(req, res, db);
  });

  router.post("/DecreaseAmount", (req, res) => {
    decreaseAmount(req, res, db);
  });

  router.post("/RemoveProduct", (req, res) => {
    removeProduct(req, res, db);
  });

  return router;
};

module.exports = cartRoutes;
