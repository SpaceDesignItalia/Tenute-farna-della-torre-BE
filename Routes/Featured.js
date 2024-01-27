const express = require("express");
const router = express.Router();

const {
  getProducts,
  notFeatured,
  createFeatured,
  deleteFeatured,
} = require("../Controllers/FeaturedController");

const featuredRoutes = (db) => {
  // Funzione per ottenere tutti i prodotti dal database
  router.get("/GetAll", (req, res) => {
    getProducts(res, db);
  });

  router.get("/NotFeatured", (req, res) => {
    notFeatured(res, db);
  });

  // Route per la creazione di un nuovo prodotto
  router.post("/CreateFeatured", (req, res) => {
    createFeatured(req, res, db);
  });

  // Route per l'eliminazione di un prodotto
  router.delete("/DeleteFeatured/:id", (req, res) => {
    deleteFeatured(req, res, db);
  });

  return router;
};

module.exports = featuredRoutes;
