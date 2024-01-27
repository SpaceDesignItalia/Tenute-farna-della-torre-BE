// productController.js

const Product = require("../Models/ProductModel");

const getProducts = async (res, db) => {
  try {
    const products = await Product.getAll(db); // Chiamata al metodo statico getAll del modello Product
    if (!products) {
      // Se non ci sono prodotti nel database, restituisco un errore
      return res.status(404).json({ error: "Nessun prodotto trovato" });
    }

    return res.status(200).json(products); // Altrimenti restituisco i prodotti
  } catch (error) {
    console.error("Errore durante la ricerca dei prodotti:", error); // Se c'è un errore, lo stampo e restituisco un errore 500
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

const getProductById = async (req, res, db) => {
  const id = req.params.id; // Ottengo l'id del prodotto dalla richiesta

  try {
    const product = await Product.findById(db, id); // Chiamata al metodo statico findById del modello Product
    if (!product) {
      // Se non c'è un prodotto con quell'id, restituisco un errore
      return res.status(404).json({ error: "Nessun prodotto trovato" });
    }
    return res.status(200).json(product); // Altrimenti restituisco il prodotto
  } catch (error) {
    console.error("Errore durante la ricerca del prodotto:", error); // Se c'è un errore, lo stampo e restituisco un errore 500
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

const getProductByName = async (req, res, db) => {
  const name = req.params; // Ottengo il nome del prodotto dalla richiesta

  try {
    const product = await Product.findByName(db, name); // Chiamata al metodo statico findByName del modello Product
    if (!product) {
      // Se non c'è un prodotto con quel nome, restituisco un errore
      return res.status(404).json({ error: "Nessun prodotto trovato" });
    }
    return res.status(200).json(product); // Altrimenti restituisco il prodotto
  } catch (error) {
    console.error("Errore durante la ricerca del prodotto:", error); // Se c'è un errore, lo stampo e restituisco un errore 500
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

const createProduct = async (req, res, db) => {
  const newProduct = req.body;
  const newProductPhoto = req.files;

  try {
    // Chiamata alla funzione createProduct del modello Product
    const result = await Product.createProduct(db, newProduct, newProductPhoto);

    // Verifica se il prodotto è stato creato con successo
    if (result) {
      return res.status(201).json({ message: "Prodotto creato con successo" });
    } else {
      return res.status(500).json({ error: "Impossibile creare il prodotto" });
    }
  } catch (error) {
    console.error("Errore durante la creazione del prodotto:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductByName,
  createProduct,
};
