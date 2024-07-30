const order = require("../Models/OrderModel.js");

const getOrdersByIdCustomer = async (req, res, db) => {
  try {
    const idCustomer = req.session.customer.id;
    const orders = await order.getOrdersByIdCustomer(db, idCustomer);
    res.status(200).send(orders);
  } catch (error) {
    console.log(error);
    res.status;
  }
};

module.exports = { getOrdersByIdCustomer };
