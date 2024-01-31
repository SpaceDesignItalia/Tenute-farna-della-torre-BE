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

const getProductByNameAndId = async (req, res, db) => {
  const name = req.params.name; // Ottengo il nome del prodotto dalla richiesta
  const id = req.params.id; // Ottengo l'id del prodotto dalla richiesta

  try {
    const product = await Product.findByNameAndId(db, name, id); // Chiamata al metodo statico findByName del modello Product

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

const getProductImagesById = async (req, res, db) => {
  const id = req.params.id; // Ottengo l'id del prodotto dalla richiesta

  try {
    const images = await Product.findPhotosById(db, id); // Chiamata al metodo statico getImagesById del modello Product

    if (!images) {
      // Se non ci sono immagini per quel prodotto, restituisco un errore
      return res.status(404).json({ error: "Nessuna immagine trovata" });
    }
    return res.status(200).json(images); // Altrimenti restituisco le immagini
  } catch (error) {
    console.error("Errore durante la ricerca delle immagini:", error); // Se c'è un errore, lo stampo e restituisco un errore 500
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

const editProduct = async (req, res, db) => {
  const id = req.params.id; // Ottengo l'id del prodotto dalla richiesta
  const editedProduct = req.body;
  const oldPhotos = req.body.oldPhotos;
  const editedProductPhoto = req.files;

  try {
    // Chiamata alla funzione editProduct del modello Product
    const result = await Product.editProduct(
      db,
      id,
      editedProduct,
      oldPhotos,
      editedProductPhoto
    );

    // Verifica se il prodotto è stato modificato con successo
    if (result) {
      return res
        .status(200)
        .json({ message: "Prodotto modificato con successo" });
    } else {
      return res
        .status(500)
        .json({ error: "Impossibile modificare il prodotto" });
    }
  } catch (error) {
    console.error("Errore durante la modifica del prodotto:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

const deleteProduct = async (req, res, db) => {
  const id = req.params.id; // Ottengo l'id del prodotto dalla richiesta

  try {
    // Chiamata alla funzione deleteProduct del modello Product
    const result = await Product.deleteProduct(db, id);

    // Verifica se il prodotto è stato eliminato con successo
    if (result) {
      return res
        .status(200)
        .json({ message: "Prodotto eliminato con successo" });
    } else {
      return res
        .status(500)
        .json({ error: "Impossibile eliminare il prodotto" });
    }
  } catch (error) {
    console.error("Errore durante l'eliminazione del prodotto:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};
module.exports = {
  getProducts,
  getProductById,
  getProductByName,
  getProductByNameAndId,
  getProductImagesById,
  createProduct,
  editProduct,
  deleteProduct,
};
