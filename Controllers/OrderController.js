const Order = require("../Models/OrderModel.js");
const order = require("../Models/OrderModel.js");

const getOrdersByIdCustomer = async (req, res, db) => {
  try {
    const idCustomer = req.session.customer.idCustomer;
    const orders = await order.getOrdersByIdCustomer(db, idCustomer);
    res.status(200).send(orders);
  } catch (error) {
    console.log(error);
    res.status;
  }
};

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

module.exports = {
  getOrdersByIdCustomer,
  getOrderByIdCustomerAndPaymentId,
  getOrderDataByIdCustomerAndPaymentId,
};
