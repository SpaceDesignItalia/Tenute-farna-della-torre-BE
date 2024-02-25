const express = require("express");
const router = express.Router();
const multer = require("multer");

// Configura Multer per la gestione dei file caricati
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Specifica la directory di destinazione dei file caricati
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + file.originalname); // Specifica il nome del file caricato
  },
});
const upload = multer({ storage: storage });

const {
  getProducts,
  getProductsEcommerce,
  getProductById,
  getProductByName,
  getProductByNameAndId,
  getProductImagesById,
  createProduct,
  editProduct,
  deleteProduct,
} = require("../Controllers/ProductController");

const productRoutes = (db) => {
  // Funzione per ottenere tutti i prodotti dal database
  router.get("/GetAll", (req, res) => {
    getProducts(res, db);
  });

  router.get("/GetProductById/:id", (req, res) => {
    getProductById(req, res, db);
  });

  router.get("/GetProductByName/:name", (req, res) => {
    getProductByName(req, res, db);
  });

  router.get("/GetProductByNameAndId/:id/:name", (req, res) => {
    getProductByNameAndId(req, res, db);
  });

  router.get("/GetProductImagesById/:id", (req, res) => {
    getProductImagesById(req, res, db);
  });

  router.get("/GetProductsEcommerce", (req, res) => {
    getProductsEcommerce(req, res, db);
  });

  // Route per la creazione di un nuovo prodotto
  router.post("/CreateProduct", upload.any(), (req, res) => {
    createProduct(req, res, db);
  });

  // Route per la modifica di un prodotto
  router.put("/EditProduct/:id", upload.any(), (req, res) => {
    editProduct(req, res, db);
  });

  //Route per l'eliminazione di un prodotto
  router.delete("/DeleteProduct/:id", (req, res) => {
    deleteProduct(req, res, db);
  });

  return router;
};

module.exports = productRoutes;
