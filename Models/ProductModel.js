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
    idDiscount,
    discountCode,
    idDiscountType,
    discountValue
  ) {
    this.idProduct = idProduct;
    this.productName = productName;
    this.productDescription = productDescription;
    this.productAmount = productAmount;
    this.unitPrice = unitPrice;
    this.idDiscount = idDiscount;
    this.discountCode = discountCode;
    this.idDiscountType = idDiscountType;
    this.discountValue = discountValue;
  }

  static getAll(db) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT p.idProduct, p.productName, p.productAmount, p.unitPrice, dc.idDiscount,dc.discountCode FROM Product p LEFT JOIN productdiscount pd ON p.idProduct = pd.idProduct LEFT JOIN discountcode dc ON pd.idDiscount = dc.idDiscount";

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
            idDiscount,
            discountCode,
          } = product;

          return new Product(
            idProduct,
            productName,
            productDescription,
            productAmount,
            unitPrice,
            idDiscount,
            discountCode
          );
        });

        resolve(products);
      });
    });
  }

  static getAllEcommerce(db) {
    return new Promise((resolve, reject) => {
      const query = `SELECT DISTINCT p.idProduct, p.productName, p.productDescription, p.productAmount, p.unitPrice, dc.value, dc.idDiscountType, dc.startDate, pi.productImagePath FROM Product p
        LEFT JOIN productdiscount pd ON p.idProduct = pd.idProduct
        LEFT JOIN discountcode dc ON pd.idDiscount = dc.idDiscount
        LEFT JOIN ( SELECT idProduct, MIN(productImagePath) AS productImagePath FROM productimage
        GROUP BY idProduct) pi ON p.idProduct = pi.idProduct;`;

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
          return {
            idProduct: product.idProduct,
            productName: product.productName,
            productDescription: product.productDescription,
            productAmount: product.productAmount,
            unitPrice: product.unitPrice,
            value: product.value,
            idDiscountType: product.idDiscountType,
            startDate: product.startDate,
            productImagePath: product.productImagePath,
          };
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
          discountCode,
        } = res[0];

        const findedProduct = new Product(
          idProduct,
          productName,
          productDescription,
          productAmount,
          unitPrice,
          discountCode
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
            discountCode,
          } = product;

          return new Product(
            idProduct,
            productName,
            productDescription,
            productAmount,
            unitPrice,
            discountCode
          );
        });

        resolve(products);
      });
    });
  }

  static findByNameAndId(db, name, id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT p.idProduct, p.productName, p.productDescription, p.productAmount, p.unitPrice, dc.idDiscountType, dc.startDate, dc.value FROM product p 
      LEFT JOIN productdiscount pd ON p.idProduct = pd.idProduct 
      LEFT JOIN discountcode dc ON pd.idDiscount = dc.idDiscount 
      LEFT JOIN discounttype dt ON dt.idDiscountType = dc.idDiscountType 
      WHERE p.productName LIKE ? AND p.idProduct = ?`;

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
          return {
            idProduct: product.idProduct,
            productName: product.productName,
            productDescription: product.productDescription,
            productAmount: product.productAmount,
            unitPrice: product.unitPrice,
            idDiscount: product.idDiscount,
            discountCode: product.discountCode,
            idDiscountType: product.idDiscountType,
            value: product.value,
            startDate: product.startDate,
          };
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

  static findLabelById(db, id) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM productLabel WHERE idProduct = ?";
      db.query(query, [id], (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        if (res.length === 0) {
          resolve(null);
          return;
        }
        const labels = res.map((label) => {
          const { idProductLabel, idProduct, idLabel, path } = label;
          return {
            idProductLabel,
            idProduct,
            idLabel,
            path,
          };
        });
        resolve(labels);
      });
    });
  }

  static getFilteredAndSortedProducts(db, minPrice, maxPrice, orderBy) {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT p.idProduct, p.productName, p.productDescription, p.productAmount, p.unitPrice, dc.value, dc.idDiscountType, dc.startDate, pi.productImagePath
        FROM Product p
        LEFT JOIN productdiscount pd ON p.idProduct = pd.idProduct
        LEFT JOIN discountcode dc ON pd.idDiscount = dc.idDiscount
        LEFT JOIN (
          SELECT idProduct, MIN(productImagePath) AS productImagePath
          FROM productimage
          GROUP BY idProduct
        ) pi ON p.idProduct = pi.idProduct
        WHERE p.unitPrice BETWEEN ? AND ?
      `;

      // Aggiungi l'ordinamento
      switch (orderBy) {
        case "ASC":
          query += " ORDER BY p.unitPrice ASC";
          break;
        case "DESC":
          query += " ORDER BY p.unitPrice DESC";
          break;
        default:
          // Nessun ordinamento specificato, lascia invariata la query
          break;
      }

      db.query(query, [minPrice, maxPrice], (err, res) => {
        if (err) {
          console.error("Errore durante l'esecuzione della query:", err);
          reject(err);
          return;
        }

        const products = res.map((product) => {
          return {
            idProduct: product.idProduct,
            productName: product.productName,
            productDescription: product.productDescription,
            productAmount: product.productAmount,
            unitPrice: product.unitPrice,
            value: product.value,
            idDiscountType: product.idDiscountType,
            startDate: product.startDate,
            productImagePath: product.productImagePath,
          };
        });

        resolve(products);
      });
    });
  }

  static createProduct(db, newProduct, newProductPhoto, newLabelPhoto) {
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
              if (photo.fieldname !== "productLabel") {
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
              }
            });

            if (newLabelPhoto) {
              const insertLabelQuery =
                "INSERT INTO productLabel (idProduct, path) VALUES (?, ?)";
              db.query(
                insertLabelQuery,
                [newProductId, newLabelPhoto.filename],
                (labelErr, labelResult) => {
                  if (labelErr) {
                    reject(labelErr);
                    return;
                  }

                  if (labelResult.affectedRows > 0) {
                    resolve(true); // Prodotto e etichetta inseriti con successo
                  } else {
                    resolve(false); // Nessun record inserito per l'etichetta
                  }
                }
              );
            } else {
              resolve(false); // Nessun record inserito per il prodotto
            }
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
    oldLabelPhoto,
    editedProductPhoto,
    editedLabelPhoto
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

        const oldLabelPhotoQuery =
          "DELETE FROM productLabel WHERE idProduct = ?";
        if (oldLabelPhoto) {
          db.query(oldLabelPhotoQuery, [id], (err, result) => {});
        }

        const addNewPhoto =
          "INSERT INTO productImage (idProduct, productImagePath) VALUES (?, ?)";
        editedProductPhoto.forEach((photo) => {
          db.query(addNewPhoto, [id, photo.filename], (err, result) => {});
        });

        const addNewLabelPhoto =
          "INSERT INTO productLabel (idProduct, path) VALUES (?, ?)";
        if (editedLabelPhoto) {
          db.query(
            addNewLabelPhoto,
            [id, editedLabelPhoto.filename],
            (err, result) => {}
          );
        }

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
