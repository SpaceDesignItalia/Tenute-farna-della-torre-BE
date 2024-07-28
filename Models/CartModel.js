class Cart {
  constructor(idProduct, idCustomer, amount) {
    this.idProduct = idProduct;
    this.idCustomer = idCustomer;
    this.amount = amount;
  }

  static async addToCart(db, idProduct, idCustomer) {
    return new Promise((resolve, reject) => {
      try {
        const selectQuery = `SELECT * FROM cart WHERE idProduct = ${idProduct} AND idCustomer = ${idCustomer}`;
        db.query(selectQuery, (err, result) => {
          if (err) {
            console.log(err);
            return reject("Errore interno del server");
          } else {
            if (result.length > 0) {
              const updateQuery = `UPDATE cart SET amount = amount + 1 WHERE idProduct = ${idProduct} AND idCustomer = ${idCustomer}`;
              db.query(updateQuery, (err, result) => {
                if (err) {
                  console.log(err);
                  return reject("Errore interno del server");
                } else {
                  return resolve("Prodotto aggiunto al carrello");
                }
              });
            } else {
              const insertQuery = `INSERT INTO cart (idProduct, idCustomer, amount) VALUES (${idProduct}, ${idCustomer}, 1)`;
              db.query(insertQuery, (err, result) => {
                if (err) {
                  console.log(err);
                  return reject("Errore interno del server");
                } else {
                  return resolve("Prodotto aggiunto al carrello");
                }
              });
            }
          }
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  static async getProductsByIdCustomer(db, idCustomer) {
    return new Promise((resolve, reject) => {
      try {
        const selectQuery = `SELECT * FROM cart INNER JOIN product ON cart.idProduct = product.idProduct INNER JOIN productImage ON product.idProduct = productImage.idProduct WHERE idCustomer = ${idCustomer}`;
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

  static async increaseAmount(db, idProduct, idCustomer) {
    return new Promise((resolve, reject) => {
      try {
        const updateQuery = `UPDATE cart SET amount = amount + 1 WHERE idProduct = ${idProduct} AND idCustomer = ${idCustomer}`;
        db.query(updateQuery, (err, result) => {
          if (err) {
            console.log(err);
            return reject("Errore interno del server");
          } else {
            return resolve("Quantità aumentata");
          }
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  static async decreaseAmount(db, idProduct, idCustomer) {
    return new Promise((resolve, reject) => {
      try {
        const selectQuery = `SELECT * FROM cart WHERE idProduct = ${idProduct} AND idCustomer = ${idCustomer}`;
        db.query(selectQuery, (err, result) => {
          if (err) {
            console.log(err);
            return reject("Errore interno del server");
          } else {
            if (result[0].amount > 1) {
              const updateQuery = `UPDATE cart SET amount = amount - 1 WHERE idProduct = ${idProduct} AND idCustomer = ${idCustomer}`;
              db.query(updateQuery, (err, result) => {
                if (err) {
                  console.log(err);
                  return reject("Errore interno del server");
                } else {
                  return resolve("Quantità diminuita");
                }
              });
            } else {
              const deleteQuery = `DELETE FROM cart WHERE idProduct = ${idProduct} AND idCustomer = ${idCustomer}`;
              db.query(deleteQuery, (err, result) => {
                if (err) {
                  console.log(err);
                  return reject("Errore interno del server");
                } else {
                  return resolve("Prodotto rimosso dal carrello");
                }
              });
            }
          }
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  static async removeProduct(db, idProduct, idCustomer) {
    return new Promise((resolve, reject) => {
      try {
        const deleteQuery = `DELETE FROM cart WHERE idProduct = ${idProduct} AND idCustomer = ${idCustomer}`;
        db.query(deleteQuery, (err, result) => {
          if (err) {
            console.log(err);
            return reject("Errore interno del server");
          } else {
            return resolve("Prodotto rimosso dal carrello");
          }
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  static async completeOrder(db, idCustomer) {
    return new Promise((resolve, reject) => {
      try {
        const selectQuery = `SELECT * FROM cart WHERE idCustomer = ${idCustomer}`;
        db.query(selectQuery, (err, result) => {
          const selectRresult = result;
          if (err) {
            console.log(err);
            return reject("Errore interno del server");
          } else {
            const idPayment =
              Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            const insertDetailsQuery = `INSERT INTO orderdetails (idCustomer, idPayment) VALUES (${idCustomer}, ${idPayment})`;
            db.query(insertDetailsQuery, (err, result) => {
              if (err) {
                console.log(err);
                return reject("Errore interno del server");
              } else {
                const idOrder = result.insertId;
                for (let i = 0; i < selectRresult.length; i++) {
                  const insertQuery = `INSERT INTO orderproduct (idOrder, idProduct, amount) VALUES (${idOrder}, ${selectRresult[i].idProduct}, ${selectRresult[i].amount})`;
                  db.query(insertQuery, (err, result) => {
                    if (err) {
                      console.log(err);
                      return reject("Errore interno del server");
                    }
                  });
                }
              }
            });
            const deleteQuery = `DELETE FROM cart WHERE idCustomer = ${idCustomer}`;
            db.query(deleteQuery, (err, result) => {
              if (err) {
                console.log(err);
                return reject("Errore interno del server");
              } else {
                return resolve("Ordine completato");
              }
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
    });
  }
}

module.exports = Cart;
