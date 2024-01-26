// productController.js
const Product = require("../Models/ProductModel");
// Funzione per ottenere tutti i prodotti dal database
const getProducts = async (res, db) => {
  try {
    const products = await Product.getAll(db);
    if (!products) {
      return res.status(404).json({ error: "Nessun prodotto trovato" });
    }
    return res.status(200).json(products);
  } catch (error) {
    console.error("Errore durante la ricerca dei prodotti:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

const getProductById = async (req, res, db) => {
  const id = req.params.id;

  try {
    const product = await Product.findById(db, id);
    if (!product) {
      return res.status(404).json({ error: "Nessun prodotto trovato" });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error("Errore durante la ricerca del prodotto:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

module.exports = {
  getProducts,
  getProductById,
};
