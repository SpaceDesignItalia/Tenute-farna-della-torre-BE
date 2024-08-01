class Order {
  constructor(idOrder, idCustomer, idPayment) {
    this.idOrder = idOrder;
    this.idCustomer = idCustomer;
    this.idPayment = idPayment;
  }

  static async getOrdersByIdCustomer(db, idCustomer) {
    return new Promise((resolve, reject) => {
      try {
        const selectQuery = `SELECT * FROM orderdetails INNER JOIN orderproduct ON orderproduct.idOrder = orderdetails.idOrder INNER JOIN product ON orderproduct.idProduct = product.idProduct INNER JOIN productimage ON product.idProduct = productimage.idProduct WHERE idCustomer = ${idCustomer}`;
        db.query(selectQuery, (err, result) => {
          if (err) {
            console.log(err);
            return reject("Errore interno del server");
          } else {
            return resolve(result);
          }
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  static async getOrderByIdCustomerAndPaymentId(db, idCustomer, IdPayment) {
    return new Promise((resolve, reject) => {
      try {
        const selectQuery = `SELECT * FROM orderdetails INNER JOIN orderproduct ON orderproduct.idOrder = orderdetails.idOrder INNER JOIN product ON orderproduct.idProduct = product.idProduct INNER JOIN productimage ON product.idProduct = productimage.idProduct INNER JOIN customershippingdetail csd ON csd.idShippingDetail = orderdetails.idShippingDetail INNER JOIN customer c ON c.idCustomer = orderdetails.idCustomer WHERE orderdetails.idCustomer = ? AND idPayment = ?`;
        db.query(selectQuery, [idCustomer, IdPayment], (err, result) => {
          if (err) {
            console.log(err);
            return reject("Errore interno del server");
          } else {
            return resolve(result);
          }
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  static async getOrderDataByIdCustomerAndPaymentId(db, idCustomer, IdPayment) {
    return new Promise((resolve, reject) => {
      try {
        const selectQuery = `SELECT * FROM orderdetails INNER JOIN customershippingdetail csd ON csd.idShippingDetail = orderdetails.idShippingDetail INNER JOIN customer c ON c.idCustomer = orderdetails.idCustomer WHERE orderdetails.idCustomer = ? AND idPayment = ?;`;
        db.query(selectQuery, [idCustomer, IdPayment], (err, result) => {
          if (err) {
            console.log(err);
            return reject("Errore interno del server");
          } else {
            return resolve(result);
          }
        });
      } catch (error) {
        console.log(error);
      }
    });
  }
}

module.exports = Order;
