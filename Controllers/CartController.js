const Cart = require("../Models/CartModel");

const addToCart = async (req, res, db) => {
  try {
    const idProduct = req.body.idProduct;
    const idCustomer = req.session.customer.id;
    await Cart.addToCart(db, idProduct, idCustomer);
    res.status(200).send("Product added to cart");
  } catch (error) {
    console.log(error);
    res.status;
  }
};

const getProductsByIdCustomer = async (req, res, db) => {
  try {
    const idCustomer = req.session.customer.id;
    const products = await Cart.getProductsByIdCustomer(db, idCustomer);
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status;
  }
};

const increaseAmount = async (req, res, db) => {
  try {
    const idProduct = req.body.idProduct;
    const idCustomer = req.session.customer.id;
    await Cart.increaseAmount(db, idProduct, idCustomer);
    res.status(200).send("Amount increased");
  } catch (error) {
    console.log(error);
    res.status;
  }
};

const decreaseAmount = async (req, res, db) => {
  try {
    const idProduct = req.body.idProduct;
    const idCustomer = req.session.customer.id;
    await Cart.decreaseAmount(db, idProduct, idCustomer);
    res.status(200).send("Amount decreased");
  } catch (error) {
    console.log(error);
    res.status;
  }
};

const removeProduct = async (req, res, db) => {
  try {
    const idProduct = req.body.idProduct;
    const idCustomer = req.session.customer.id;
    await Cart.removeProduct(db, idProduct, idCustomer);
    res.status(200).send("Product removed from cart");
  } catch (error) {
    console.log(error);
    res.status;
  }
};

module.exports = {
  addToCart,
  getProductsByIdCustomer,
  increaseAmount,
  decreaseAmount,
  removeProduct,
};
