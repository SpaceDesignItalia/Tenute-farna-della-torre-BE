// productModel.js
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
}

module.exports = Product;
