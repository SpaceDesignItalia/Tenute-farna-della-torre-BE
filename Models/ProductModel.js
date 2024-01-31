// productModel.js

const fs = require("fs");
const path = require("path");

class Product {
  constructor(
    idProduct,
    productName,
    productDescription,
    productAmount,
    unitPrice,
    isDiscount
  ) {
    this.idProduct = idProduct;
    this.productName = productName;
    this.productDescription = productDescription;
    this.productAmount = productAmount;
    this.unitPrice = unitPrice;
    this.isDiscount = isDiscount;
  }

  static getAll(db) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM Product";

      db.query(query, (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        if (res.length === 0) {
          resolve(null);
          return;
        }

        const products = res.map((product) => {
          const {
            idProduct,
            productName,
            productDescription,
            productAmount,
            unitPrice,
            isDiscount,
          } = product;

          return new Product(
            idProduct,
            productName,
            productDescription,
            productAmount,
            unitPrice,
            isDiscount
          );
        });

        resolve(products);
      });
    });
  }

  static findById(db, id) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM Product WHERE idProduct = ?";
      db.query(query, [id], (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        if (res.length === 0) {
          resolve(null);
          return;
        }

        const {
          idProduct,
          productName,
          productDescription,
          productAmount,
          unitPrice,
          isDiscount,
        } = res[0];

        const findedProduct = new Product(
          idProduct,
          productName,
          productDescription,
          productAmount,
          unitPrice,
          isDiscount
        );

        resolve(findedProduct);
      });
    });
  }

  static findByName(db, { name }) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM Product WHERE productName LIKE ?";
      db.query(query, [`%${name}%`], (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        if (res.length === 0) {
          resolve(null);
          return;
        }

        const products = res.map((product) => {
          const {
            idProduct,
            productName,
            productDescription,
            productAmount,
            unitPrice,
            isDiscount,
          } = product;

          return new Product(
            idProduct,
            productName,
            productDescription,
            productAmount,
            unitPrice,
            isDiscount
          );
        });

        resolve(products);
      });
    });
  }

  static findByNameAndId(db, name, id) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT * FROM product WHERE productName LIKE ? AND idProduct = ?";
      db.query(query, [name, id], (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        if (res.length === 0) {
          resolve(null);
          return;
        }

        const products = res.map((product) => {
          const {
            idProduct,
            productName,
            productDescription,
            productAmount,
            unitPrice,
            isDiscount,
          } = product;

          return new Product(
            idProduct,
            productName,
            productDescription,
            productAmount,
            unitPrice,
            isDiscount
          );
        });

        resolve(products);
      });
    });
  }

  static findPhotosById(db, id) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM productImage WHERE idProduct = ?";
      db.query(query, [id], (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        if (res.length === 0) {
          resolve(null);
          return;
        }

        const photos = res.map((photo) => {
          const { idProductImage, idProduct, productImagePath } = photo;

          return {
            idProductImage,
            idProduct,
            productImagePath,
          };
        });

        resolve(photos);
      });
    });
  }

  static createProduct(db, newProduct, newProductPhoto) {
    return new Promise((resolve, reject) => {
      // Query per inserire il nuovo prodotto
      const insertProductQuery =
        "INSERT INTO Product (productName, productDescription, productAmount, unitPrice) VALUES (?, ?, ?, ?)";

      db.query(
        insertProductQuery,
        [
          newProduct.productName,
          newProduct.productDescription,
          newProduct.productAmount,
          newProduct.unitPrice,
        ],
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }

          // Verifica se il prodotto è stato inserito correttamente
          if (result.affectedRows > 0) {
            // ID del nuovo prodotto inserito
            const newProductId = result.insertId;

            // Query per inserire l'immagine del prodotto nella tabella productImage
            const insertImageQuery =
              "INSERT INTO productImage (idProduct, productImagePath) VALUES (?, ?)";

            newProductPhoto.forEach((photo) => {
              db.query(
                insertImageQuery,
                [newProductId, photo.filename],
                (imageErr, imageResult) => {
                  if (imageErr) {
                    reject(imageErr);
                    return;
                  }

                  // Verifica se l'immagine è stata inserita correttamente
                  if (imageResult.affectedRows > 0) {
                    resolve(true); // Prodotto e immagine inseriti con successo
                  } else {
                    resolve(false); // Nessun record inserito per l'immagine
                  }
                }
              );
            });
          } else {
            resolve(false); // Nessun record inserito per il prodotto
          }
        }
      );
    });
  }

  static async editProduct(
    db,
    id,
    editedProduct,
    oldPhotos,
    editedProductPhoto
  ) {
    return new Promise((resolve, reject) => {
      const getOldPhotosQuery =
        "SELECT COUNT(*) FROM productImage WHERE idProduct = ?";
      var oldPhotosCount;
      db.query(getOldPhotosQuery, [id], (err, result) => {
        oldPhotosCount = result[0];
      });

      if (
        editedProductPhoto.length > 0 ||
        oldPhotos.length !== oldPhotosCount
      ) {
        // Eliminazione delle foto del prodotto dal database
        const getOldPhotosQuery =
          "SELECT productImagePath FROM productImage WHERE idProduct = ? AND productImagePath NOT IN (?)";
        db.query(getOldPhotosQuery, [id, oldPhotos], (err, result) => {
          if (err) {
            reject(err);
            return;
          }

          if (result && result.length > 0) {
            result.forEach((photo) => {
              if (photo.productImagePath) {
                // Verifica se la proprietà productImagePath è definita
                fs.unlinkSync(
                  path.join("public", "uploads", photo.productImagePath)
                );
              }
            });
          }
        });

        const oldPhotosQuery =
          "DELETE FROM productImage WHERE idProduct = ? AND productImagePath NOT IN (?)";
        db.query(oldPhotosQuery, [id, oldPhotos], (err, result) => {});

        const addNewPhoto =
          "INSERT INTO productImage (idProduct, productImagePath) VALUES (?, ?)";
        editedProductPhoto.forEach((photo) => {
          db.query(addNewPhoto, [id, photo.filename], (err, result) => {});
        });

        const updateProductQuery =
          "UPDATE Product SET productName = ?, productDescription = ?, productAmount = ?, unitPrice = ? WHERE idProduct = ?";
        db.query(
          updateProductQuery,
          [
            editedProduct.productName,
            editedProduct.productDescription,
            editedProduct.productAmount,
            editedProduct.unitPrice,
            id,
          ],
          (updateErr, updateResult) => {
            if (updateErr) {
              reject(updateErr);
              return;
            }
            resolve(updateResult.affectedRows > 0); // True se il prodotto è stato aggiornato, altrimenti False
          }
        );

        resolve(true);
      } else {
        // Aggiorna i dati del prodotto
        const updateProductQuery =
          "UPDATE Product SET productName = ?, productDescription = ?, productAmount = ?, unitPrice = ? WHERE idProduct = ?";
        db.query(
          updateProductQuery,
          [
            editedProduct.productName,
            editedProduct.productDescription,
            editedProduct.productAmount,
            editedProduct.unitPrice,
            id,
          ],
          (updateErr, updateResult) => {
            if (updateErr) {
              reject(updateErr);
              return;
            }
            resolve(updateResult.affectedRows > 0); // True se il prodotto è stato aggiornato, altrimenti False
          }
        );
      }
    });
  }

  static deleteProduct(db, id) {
    return new Promise((resolve, reject) => {
      const getProductPhotosQuery =
        "SELECT productImagePath FROM productImage WHERE idProduct = ?";
      const deleteProductQuery = "DELETE FROM Product WHERE idProduct = ?";

      db.query(getProductPhotosQuery, [id], (photoErr, photoResults) => {
        if (photoErr) {
          reject(photoErr);
          return;
        }

        const photoPaths = photoResults.map((photo) => photo.productImagePath);

        // Eliminazione dei file dal server
        photoPaths.forEach((photoPath) => {
          const filePath = path.join("public", "uploads", photoPath);

          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              reject(unlinkErr);
              return;
            }
          });
        });

        // Eliminazione del prodotto dal database
        db.query(deleteProductQuery, [id], (err, result) => {
          if (err) {
            reject(err);
            return;
          }

          // Verifica se il prodotto è stato eliminato correttamente
          if (result.affectedRows > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    });
  }
}

module.exports = Product;
