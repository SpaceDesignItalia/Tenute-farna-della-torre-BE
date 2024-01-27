// productController.js

const Featured = require("../Models/FeaturedModel");

const getProducts = async (res, db) => {
  try {
    const products = await Featured.getAll(db);
    if (!products) {
      res.status(404).send("No products found");
      return;
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error during products search:", error);
    res.status(500).send("Internal server error");
  }
};

const notFeatured = async (res, db) => {
  try {
    const products = await Featured.notFeatured(db);
    if (!products) {
      res.status(404).send("No products found");
      return;
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error during products search:", error);
    res.status(500).send("Internal server error");
  }
};

const createFeatured = async (req, res, db) => {
  const idProduct = req.body.idProduct;

  if (!idProduct) {
    res.status(400).send("Missing required fields");
    return;
  }

  Featured.createFeatured(idProduct, db)
    .then((result) => {
      res.status(201).send("Featured created");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

const deleteFeatured = async (req, res, db) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).send("Missing required fields");
    return;
  }

  Featured.delete(id, db)
    .then((result) => {
      res.status(200).send("Featured deleted");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

module.exports = {
  getProducts,
  notFeatured,
  createFeatured,
  deleteFeatured,
};
