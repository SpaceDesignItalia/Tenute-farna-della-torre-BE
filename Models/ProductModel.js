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
        "SELECT p.idProduct, p.productName, p.productAmount, p.unitPrice, dc.idDiscount,dc.discountCode FROM product p LEFT JOIN productdiscount pd ON p.idProduct = pd.idProduct LEFT JOIN discountcode dc ON pd.idDiscount = dc.idDiscount";

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
      const query = `SELECT DISTINCT p.idProduct, p.productName, p.productDescription, p.productAmount, p.unitPrice, dc.value, dc.idDiscountType, dc.startDate, pi.productImagePath FROM product p
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
      const query = "SELECT * FROM product WHERE idProduct = ?";
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
      const query = "SELECT * FROM product WHERE productName LIKE ?";
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
      const query = "SELECT * FROM productimage WHERE idProduct = ?";
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
      const query = "SELECT * FROM productlabel WHERE idProduct = ?";
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
        resolve(labels[0]);
      });
    });
  }

  static getFilteredAndSortedProducts(db, minPrice, maxPrice, orderBy) {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT p.idProduct, p.productName, p.productDescription, p.productAmount, p.unitPrice, dc.value, dc.idDiscountType, dc.startDate, pi.productImagePath
        FROM product p
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
        "INSERT INTO product (productName, productDescription, productAmount, unitPrice) VALUES (?, ?, ?, ?)";

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

            const insertImageQuery =
              "INSERT INTO productimage (idProduct, productImagePath) VALUES (?, ?)";
            const insertLabelQuery =
              "INSERT INTO productlabel (idProduct, path) VALUES (?, ?)";

            // Gestire le promesse per le immagini e le etichette
            const imagePromises = newProductPhoto.map((photo) => {
              return new Promise((resolve, reject) => {
                db.query(
                  insertImageQuery,
                  [newProductId, photo.filename],
                  (imageErr, imageResult) => {
                    if (imageErr) {
                      reject(imageErr);
                      return;
                    }
                    resolve(imageResult.affectedRows > 0);
                  }
                );
              });
            });

            let labelPromise = Promise.resolve(true);
            if (newLabelPhoto !== null) {
              labelPromise = new Promise((resolve, reject) => {
                db.query(
                  insertLabelQuery,
                  [newProductId, newLabelPhoto.filename],
                  (labelErr, labelResult) => {
                    if (labelErr) {
                      reject(labelErr);
                      return;
                    }
                    resolve(labelResult.affectedRows > 0);
                  }
                );
              });
            }

            // Attendere che tutte le promesse siano risolte
            Promise.all([...imagePromises, labelPromise])
              .then((results) => {
                // Verifica se tutte le promesse sono state risolte con successo
                const allSucceeded = results.every((result) => result === true);
                resolve(allSucceeded);
              })
              .catch((error) => {
                reject(error);
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
    editedProductPhoto,
    editedLabelPhoto,
    deletedLabel
  ) {
    console.log(editedLabelPhoto);
    return new Promise((resolve, reject) => {
      const getOldPhotosQuery =
        "SELECT COUNT(*) FROM productimage WHERE idProduct = ?";
      db.query(getOldPhotosQuery, [id], (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        const oldPhotosCount = result[0]["COUNT(*)"];

        if (
          editedProductPhoto.length > 0 ||
          oldPhotos.length !== oldPhotosCount
        ) {
          // Eliminazione delle foto del prodotto dal database
          const getOldPhotosQuery =
            "SELECT productImagePath FROM productimage WHERE idProduct = ? AND productImagePath NOT IN (?)";
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
            "DELETE FROM productimage WHERE idProduct = ? AND productImagePath NOT IN (?)";
          db.query(oldPhotosQuery, [id, oldPhotos], (err, result) => {
            if (err) {
              reject(false);
              return;
            }
            if (editedProductPhoto) {
              const addNewPhoto =
                "INSERT INTO productimage (idProduct, productImagePath) VALUES (?, ?)";
              editedProductPhoto.forEach((photo) => {
                db.query(addNewPhoto, [id, photo.filename], (err, result) => {
                  if (err) {
                    reject(false);
                    return;
                  }
                });
              });
            }
          });
        }

        if (editedLabelPhoto !== null) {
          // Inserimento dell'etichetta aggiornata
          const updateLabelQuery =
            "INSERT INTO productlabel (idProduct, path) VALUES (?, ?)";
          db.query(
            updateLabelQuery,
            [id, editedLabelPhoto.filename],
            (err, result) => {
              if (err) {
                reject(err);
                return;
              }
              // Ottenere e eliminare la vecchia etichetta dal server
              const getOldLabel =
                "SELECT * FROM productlabel WHERE idProduct = ? AND path <> ?";
              db.query(
                getOldLabel,
                [id, editedLabelPhoto.filename],
                (err, result) => {
                  if (err) {
                    reject(err);
                    return;
                  }
                  if (result && result.length > 0) {
                    result.forEach((label) => {
                      fs.unlinkSync(path.join("public", "uploads", label.path));
                    });
                    // Eliminazione delle vecchie etichette dal database
                    const deleteOldLabelQuery =
                      "DELETE FROM productlabel WHERE idProduct = ? AND path <> ?";
                    db.query(
                      deleteOldLabelQuery,
                      [id, editedLabelPhoto.filename],
                      (err, result) => {
                        if (err) {
                          reject(err);
                          return;
                        }
                        resolve(true);
                      }
                    );
                  } else {
                    resolve(true);
                  }
                }
              );
            }
          );
        }

        if (deletedLabel) {
          // Eliminazione della vecchia etichetta se editedLabelPhoto è null
          const getOldLabel = "SELECT * FROM productlabel WHERE idProduct = ?";
          db.query(getOldLabel, [id], (err, result) => {
            if (err) {
              reject(err);
              return;
            }
            if (result && result.length > 0) {
              result.forEach((label) => {
                fs.unlinkSync(path.join("public", "uploads", label.path));
              });
              const deleteOldLabelQuery =
                "DELETE FROM productlabel WHERE idProduct = ?";
              db.query(deleteOldLabelQuery, [id], (err, result) => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(true);
              });
            } else {
              resolve(true);
            }
          });
        }

        // Aggiornamento dei dati del prodotto
        const updateProductQuery =
          "UPDATE product SET productName = ?, productDescription = ?, productAmount = ?, unitPrice = ? WHERE idProduct = ?";
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
      });
    });
  }

  static deleteProduct(db, id) {
    return new Promise((resolve, reject) => {
      const getProductPhotosQuery =
        "SELECT productImagePath FROM productimage WHERE idProduct = ?";
      const getProductLabelQuery =
        "SELECT path FROM productlabel WHERE idProduct = ?";
      const deleteProductQuery = "DELETE FROM product WHERE idProduct = ?";
      const deleteProductImagesQuery =
        "DELETE FROM productimage WHERE idProduct = ?";
      const deleteProductLabelsQuery =
        "DELETE FROM productlabel WHERE idProduct = ?";

      // First, retrieve product photos
      db.query(getProductPhotosQuery, [id], (photoErr, photoResults) => {
        if (photoErr) {
          reject(photoErr);
          return;
        }

        const photoPaths = photoResults.map((photo) => photo.productImagePath);

        // Delete photo files from the server
        photoPaths.forEach((photoPath) => {
          const filePath = path.join("public", "uploads", photoPath);

          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              reject(unlinkErr);
              return;
            }
          });
        });

        // Then, retrieve product labels
        db.query(getProductLabelQuery, [id], (labelErr, labelResults) => {
          if (labelErr) {
            reject(labelErr);
            return;
          }

          const labelPaths = labelResults.map((label) => label.path);

          // Delete label files from the server
          labelPaths.forEach((labelPath) => {
            const labelFilePath = path.join("public", "uploads", labelPath);

            fs.unlink(labelFilePath, (unlinkErr) => {
              if (unlinkErr) {
                reject(unlinkErr);
                return;
              }
            });
          });

          // Finally, delete product from the database
          db.query(deleteProductQuery, [id], (err, result) => {
            if (err) {
              reject(err);
              return;
            }

            // Delete product images from the database
            db.query(
              deleteProductImagesQuery,
              [id],
              (imageErr, imageResult) => {
                if (imageErr) {
                  reject(imageErr);
                  return;
                }

                // Delete product labels from the database
                db.query(
                  deleteProductLabelsQuery,
                  [id],
                  (labelErr, labelResult) => {
                    if (labelErr) {
                      reject(labelErr);
                      return;
                    }

                    // Verify if the product was deleted correctly
                    if (result.affectedRows > 0) {
                      resolve(true);
                    } else {
                      resolve(false);
                    }
                  }
                );
              }
            );
          });
        });
      });
    });
  }
}

module.exports = Product;
