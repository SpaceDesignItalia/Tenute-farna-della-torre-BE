const Cart = require("../Models/CartModel");

const getCartItemNumber = async (req, res, db) => {
  try {
    const idCustomer = req.session.customer.idCustomer;
    const items = await Cart.getItemsNumber(db, idCustomer);
    res.status(200).send(items);
  } catch (error) {
    console.log(error);
    res.status;
  }
};

const addToCart = async (req, res, db) => {
  try {
    const idProduct = req.body.idProduct;
    const idCustomer = req.session.customer.idCustomer;
    await Cart.addToCart(db, idProduct, idCustomer);
    res.status(200).send("Product added to cart");
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

const getProductsByIdCustomer = async (req, res, db) => {
  try {
    const products = await Cart.getProductsByIdCustomer(
      db,
      req.session.customer.idCustomer
    );
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status;
  }
};

const checkStock = async (req, res, db) => {
  try {
    const idProduct = req.query.idProduct;
    const stock = await Cart.checkStock(db, idProduct);
    res.status(200).json({ stock: stock.productAmount });
  } catch (error) {
    console.log(error);
    res.status(500).send("Errore interno del server");
  }
};

const updateAmount = async (req, res, db) => {
  try {
    const idProduct = req.body.idProduct;
    const newAmount = req.body.amount;

    const isStockAvailable = await Cart.checkStock(db, idProduct, newAmount);

    if (!isStockAvailable) {
      return res.status(400).send("Quantità non disponibile");
    }

    await Cart.updateAmount(
      db,
      idProduct,
      req.session.customer.idCustomer,
      newAmount
    );
    res.status(200).send("Quantità aggiornata");
  } catch (error) {
    console.log(error);
    res.status(500).send("Errore interno del server");
  }
};

const removeProduct = async (req, res, db) => {
  try {
    const idProduct = req.body.idProduct;
    await Cart.removeProduct(db, idProduct, req.session.customer.idCustomer);
    res.status(200).send("Product removed from cart");
  } catch (error) {
    console.log(error);
    res.status;
  }
};

const completeOrder = async (req, res, db) => {
  try {
    const shippingId = req.body.shippingId;
    const idPayment = req.body.idPayment;

    await Cart.completeOrder(
      db,
      req.session.customer.idCustomer,
      shippingId,
      idPayment
    );
    res.status(200).send("Order completed");
  } catch (error) {
    console.log(error);
    res.status;
  }
};

module.exports = {
  addToCart,
  getProductsByIdCustomer,
  checkStock,
  updateAmount,
  removeProduct,
  completeOrder,
  getCartItemNumber,
};
