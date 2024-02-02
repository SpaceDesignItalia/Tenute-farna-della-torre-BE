const express = require("express");
const router = express.Router();

const {
  getDiscounts,
  getAllCodes,
  getDiscountByCode,
  getDiscountDataById,
  getDiscountProductsById,
  getProductsWithoutDiscount,
  creteDiscount,
  deleteDiscount,
} = require("../Controllers/DiscountController");

const discountRoutes = (db) => {
  // Funzione per ottenere tutti i prodotti dal database
  router.get("/GetAll", async (req, res) => {
    getDiscounts(res, db);
  });

  router.get("/GetAllCodes", async (req, res) => {
    getAllCodes(res, db);
  });

  router.get("GetDiscountByCode/:code", async (req, res) => {
    getDiscountByCode(res, req, db);
  });

  router.get("/GetDiscountDataById/:id", async (req, res) => {
    getDiscountDataById(res, req, db);
  });

  router.get("/GetDiscountProductsById/:id", async (req, res) => {
    getDiscountProductsById(res, req, db);
  });

  router.get("/GetProductWithoutDiscount", async (req, res) => {
    getProductsWithoutDiscount(res, db);
  });

  // Funzione per la creazione di un nuovo sconto
  router.post("/CreateDiscount", async (req, res) => {
    creteDiscount(req, res, db);
  });

  // Funzione per la cancellazione di uno sconto
  router.delete("/DeleteDiscount/:id", async (req, res) => {
    deleteDiscount(req, res, db);
  });

  return router;
};

module.exports = discountRoutes;
