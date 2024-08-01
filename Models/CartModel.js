class Cart {
  constructor(idProduct, idCustomer, amount) {
    this.idProduct = idProduct;
    this.idCustomer = idCustomer;
    this.amount = amount;
  }

  static async getItemsNumber(db, idCustomer) {
    return new Promise((resolve, reject) => {
      const checkStockQuery = `SELECT COUNT(*) AS items FROM cart WHERE idCustomer = ?`;
      db.query(checkStockQuery, [idCustomer], (err, result) => {
        if (err) {
          console.log(err);
          reject("Errore interno del server");
        }
        resolve(result);
      });
    });
  }
  static async addToCart(db, idProduct, idCustomer) {
    return new Promise((resolve, reject) => {
      try {
        const checkStockQuery = `SELECT productAmount FROM product WHERE idProduct = ${idProduct}`;
        db.query(checkStockQuery, (err, result) => {
          console.log(result[0].productAmount);
          if (err) {
            console.log(err);
            return reject("Errore interno del server");
          } else {
            if (result[0].productAmount === 0) {
              return reject("Prodotto non disponibile");
            } else {
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
        // Query per ottenere i prodotti nel carrello con i dettagli
        const selectQuery = `
          SELECT 
            cart.idProduct, 
            cart.amount, 
            product.productAmount, 
            product.unitPrice, 
            product.productName,
            productimage.productImagePath
          FROM cart
          INNER JOIN product ON cart.idProduct = product.idProduct
          INNER JOIN productimage ON product.idProduct = productimage.idProduct
          WHERE cart.idCustomer = ?
        `;

        // Esegui la query
        db.query(selectQuery, [idCustomer], async (err, result) => {
          if (err) {
            console.log(err);
            return reject("Errore interno del server");
          }

          try {
            // Filtra i prodotti per quelli con stock 0 e aggiorna la quantità
            const updatedCartItems = [];
            for (const item of result) {
              if (item.productAmount === 0) {
                // Rimuovi il prodotto dal carrello se stock è 0
                await db.query(
                  "DELETE FROM cart WHERE idProduct = ? AND idCustomer = ?",
                  [item.idProduct, idCustomer]
                );
              } else {
                // Imposta la quantità a 1 se la quantità scelta non è disponibile
                const finalAmount =
                  item.amount > item.productAmount ? 1 : item.amount;
                if (finalAmount !== item.amount) {
                  await db.query(
                    "UPDATE cart SET amount = ? WHERE idProduct = ? AND idCustomer = ?",
                    [finalAmount, item.idProduct, idCustomer]
                  );
                }
                // Aggiungi l'elemento aggiornato alla lista
                updatedCartItems.push({
                  ...item,
                  amount: finalAmount,
                });
              }
            }

            // Restituisci la lista aggiornata dei prodotti nel carrello
            resolve(updatedCartItems);
          } catch (updateError) {
            console.log(updateError);
            reject("Errore interno durante l'aggiornamento del carrello");
          }
        });
      } catch (error) {
        console.log(error);
        reject("Errore interno del server");
      }
    });
  }

  static async checkStock(db, idProduct, requestedAmount) {
    return new Promise((resolve, reject) => {
      try {
        const checkStockQuery = `SELECT productAmount FROM product WHERE idProduct = ?`;
        db.query(checkStockQuery, [idProduct], (err, result) => {
          if (err) {
            console.log(err);
            return reject("Errore interno del server");
          } else {
            if (result[0].productAmount < requestedAmount) {
              return resolve(false);
            } else {
              return resolve(true);
            }
          }
        });
      } catch (error) {
        console.log(error);
        return reject("Errore interno del server");
      }
    });
  }

  static async updateAmount(db, idProduct, idCustomer, amount) {
    return new Promise((resolve, reject) => {
      try {
        const updateQuery = `UPDATE cart SET amount = ? WHERE idProduct = ? AND idCustomer = ?`;
        db.query(
          updateQuery,
          [amount, idProduct, idCustomer],
          (err, result) => {
            if (err) {
              console.log(err);
              return reject("Errore interno del server");
            } else {
              return resolve("Quantità aggiornata");
            }
          }
        );
      } catch (error) {
        console.log(error);
        return reject("Errore interno del server");
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

  static async completeOrder(db, idCustomer, shippingId, idPayment) {
    return new Promise((resolve, reject) => {
      try {
        const selectQuery = `SELECT * FROM cart WHERE idCustomer = ${idCustomer}`;
        db.query(selectQuery, (err, result) => {
          const selectRresult = result;
          if (err) {
            console.log(err);
            return reject("Errore interno del server");
          } else {
            const insertDetailsQuery = `INSERT INTO orderdetails (idCustomer, idShippingDetail, idPayment) VALUES (?, ?, ?)`;
            db.query(
              insertDetailsQuery,
              [idCustomer, shippingId, idPayment],
              (err, result) => {
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

                    const decreaseQuery = `UPDATE product SET productAmount = productAmount - ${selectRresult[i].amount} WHERE idProduct = ${selectRresult[i].idProduct}`;
                    db.query(decreaseQuery, (err, result) => {
                      if (err) {
                        console.log(err);
                        return reject("Errore interno del server");
                      }
                    });
                  }
                }
              }
            );
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
