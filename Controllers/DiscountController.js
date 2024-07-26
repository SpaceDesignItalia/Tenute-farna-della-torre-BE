// discountcontroller.js

const Discount = require("../Models/DiscountModel");

const getDiscounts = async (res, db) => {
  try {
    const discounts = await Discount.getAll(db);

    if (!discounts) {
      return res.status(404).json({ error: "Nessuno sconto trovato" });
    }
    res.status(200).json(discounts);
  } catch (err) {
    console.error("Errore durante la ricerca degli sconti:", err);
    res.status(500).json({ error: "Errore interno del server" });
  }
};

const getAllCodes = async (res, db) => {
  try {
    const codes = await Discount.getAllCodes(db);

    if (!codes) {
      return res.status(404).json({ error: "Nessun codice trovato" });
    }
    res.status(200).json(codes);
  } catch (err) {
    console.error("Errore durante la ricerca dei codici:", err);
    res.status(500).json({ error: "Errore interno del server" });
  }
};

const getDiscountByCode = async (res, req, db) => {
  const Code = req.params.Code;
  console.log(Code);
  try {
    const discount = await Discount.getDiscountByCode(db, Code);

    if (!discount) {
      return res.status(404).json({ error: "Nessuno sconto trovato" });
    }
    res.status(200).json(discount);
  } catch (err) {
    console.error("Errore durante la ricerca dello sconto:", err);
    res.status(500).json({ error: "Errore interno del server" });
  }
};

const getDiscountDataById = async (res, req, db) => {
  const id = req.params.id;
  try {
    const discount = await Discount.getDiscountDataById(db, id);

    if (!discount) {
      return res.status(404).json({ error: "Nessuno sconto trovato" });
    }
    res.status(200).json(discount);
  } catch (err) {
    console.error("Errore durante la ricerca dello sconto:", err);
    res.status(500).json({ error: "Errore interno del server" });
  }
};

const getDiscountProductsById = async (res, req, db) => {
  const id = req.params.id;
  try {
    const products = await Discount.getDiscountProductsById(db, id);

    if (!products) {
      return res.status(404).json({ error: "Nessun prodotto trovato" });
    }
    res.status(200).json(products);
  } catch (err) {
    console.error("Errore durante la ricerca dei prodotti:", err);
    res.status(500).json({ error: "Errore interno del server" });
  }
};

const getProductsWithoutDiscount = async (res, db) => {
  try {
    const products = await Discount.getProductsWithoutDiscount(db);

    if (!products) {
      return res.status(404).json({ error: "Nessun prodotto trovato" });
    }
    res.status(200).json(products);
  } catch (err) {
    console.error("Errore durante la ricerca dei prodotti:", err);
    res.status(500).json({ error: "Errore interno del server" });
  }
};

const creteDiscount = async (req, res, db) => {
  const newDiscount = req.body;

  try {
    const result = await Discount.createDiscount(newDiscount, db);

    if (!result) {
      return res.status(400).json({ error: "Sconto non creato" });
    }
    res.status(201).json({ message: "Sconto creato" });
  } catch (err) {
    console.error("Errore durante la creazione dello sconto:", err);
    res.status(500).json({ error: "Errore interno del server" });
  }
};

const deleteDiscount = async (req, res, db) => {
  const id = req.params.id;

  try {
    const result = await Discount.deleteDiscount(id, db);

    if (!result) {
      return res.status(400).json({ error: "Sconto non cancellato" });
    }
    res.status(200).json({ message: "Sconto cancellato" });
  } catch (err) {
    console.error("Errore durante la cancellazione dello sconto:", err);
    res.status(500).json({ error: "Errore interno del server" });
  }
};

module.exports = {
  getDiscounts,
  getAllCodes,
  getDiscountByCode,
  getDiscountDataById,
  getDiscountProductsById,
  getProductsWithoutDiscount,
  creteDiscount,
  deleteDiscount,
};
