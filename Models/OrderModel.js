class Order {
  constructor(idOrder, idCustomer, idPayment) {
    this.idOrder = idOrder;
    this.idCustomer = idCustomer;
    this.idPayment = idPayment;
  }

  static async getAllOrders(db) {
    return new Promise((resolve, reject) => {
      try {
        const selectQuery = `SELECT * FROM orderdetails`;
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

  static async getOrderById(db, idOrder) {
    return new Promise((resolve, reject) => {
      try {
        const selectQuery = `SELECT * FROM orderdetails WHERE idOrder = ?`;
        db.query(selectQuery, [idOrder], (err, result) => {
          if (err) {
            console.log(err);
            return reject("Errore interno del server");
          } else {
            return resolve(result);
          }
        });
      } catch (error) {}
    });
  }

  static async getOrdersByIdCustomer(db, idCustomer) {
    return new Promise((resolve, reject) => {
      try {
        const selectQuery = `SELECT * FROM orderdetails INNER JOIN orderproduct ON orderproduct.idOrder = orderdetails.idOrder INNER JOIN product ON orderproduct.idProduct = product.idProduct INNER JOIN productimage ON product.idProduct = productimage.idProduct WHERE idCustomer = ?`;
        db.query(selectQuery, [idCustomer], (err, result) => {
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

  static async getProductsByIdOrder(db, idOrder) {
    return new Promise((resolve, reject) => {
      try {
        const selectQuery = `SELECT * FROM orderproduct INNER JOIN product ON orderproduct.idProduct = product.idProduct INNER JOIN productimage ON product.idProduct = productimage.idProduct WHERE idOrder = ?`;
        db.query(selectQuery, [idOrder], (err, result) => {
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

  static async deleteOrder(db, idOrder) {
    return new Promise((resolve, reject) => {
      try {
        const deleteQuery = `DELETE FROM orderdetails WHERE idOrder = ?`;
        db.query(deleteQuery, [idOrder], (err, result) => {
          if (err) {
            console.log(err);
            return reject("Errore interno del server");
          } else {
            return resolve("Ordine eliminato correttamente");
          }
        });
      } catch (error) {
        console.log(error);
      }
    });
  }
}

module.exports = Order;
