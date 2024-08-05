const order = require("../Models/OrderModel.js");

const getAllOrders = async (req, res, db) => {
  try {
    const orders = await order.getAllOrders(db);
    res.status(200).send(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting orders");
  }
};

const getOrderById = async (req, res, db) => {
  try {
    const idOrder = req.query.idOrder;
    const orderData = await order.getOrderById(db, idOrder);
    res.status(200).send(orderData);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting order by ID");
  }
};

const getOrdersByIdCustomer = async (req, res, db) => {
  try {
    const idCustomer = req.session.customer.id;
    const orders = await order.getOrdersByIdCustomer(db, idCustomer);
    res.status(200).send(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting orders by customer ID");
  }
};

const getProductsByIdOrder = async (req, res, db) => {
  try {
    const idOrder = req.query.idOrder;
    const products = await order.getProductsByIdOrder(db, idOrder);
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting products by order ID");
  }
};

const deleteOrder = async (req, res, db) => {
  try {
    const idOrder = req.query.idOrder;
    const message = await order.deleteOrder(db, idOrder);
    res.status(200).send(message);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error deleting order");
const getOrderByIdCustomerAndPaymentId = async (req, res, db) => {
  try {
    const IdPayment = req.query.IdPayment;
    const products = await Order.getOrderByIdCustomerAndPaymentId(
      db,
      req.session.customer.idCustomer,
      IdPayment
    );
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status;
  }
};

const getProductsByIdOrder = async (req, res, db) => {
  try {
    const idOrder = req.query.idOrder;
    const products = await order.getProductsByIdOrder(db, idOrder);
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting products by order ID");
  }
};
const getOrderDataByIdCustomerAndPaymentId = async (req, res, db) => {
  try {
    const idCustomer = req.session.customer.idCustomer;
    const IdPayment = req.query.IdPayment;
    const products = await Order.getOrderDataByIdCustomerAndPaymentId(
      db,
      idCustomer,
      IdPayment
    );
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status;
  }
};

const deleteOrder = async (req, res, db) => {
  try {
    const idOrder = req.query.idOrder;
    const message = await order.deleteOrder(db, idOrder);
    res.status(200).send(message);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error deleting order");
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  getProductsByIdOrder,
  getOrdersByIdCustomer,
  deleteOrder,
};

module.exports = {
  getAllOrders,
  getOrderById,
  getProductsByIdOrder,
  getOrdersByIdCustomer,
  deleteOrder,
  getOrdersByIdCustomer,
  getOrderByIdCustomerAndPaymentId,
  getOrderDataByIdCustomerAndPaymentId,
};
