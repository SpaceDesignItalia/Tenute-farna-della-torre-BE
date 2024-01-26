const express = require("express");
const router = express.Router();

const e = require("express");
const {
  getProducts,
  getProductById,
} = require("../Controllers/ProductController");

const productRoutes = (db) => {
  // Funzione per ottenere tutti i prodotti dal database
  router.get("/GetAll", (req, res) => {
    getProducts(res, db);
  });

  router.get("/GetProductById/:id", (req, res) => {
    getProductById(req, res, db);
  });
  return router;
};

module.exports = productRoutes;
