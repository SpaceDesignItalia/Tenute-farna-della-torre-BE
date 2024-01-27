// featuredModel.js
class Featured {
  constructor(
    idProduct,
    productName,
    productAmount,
    unitPrice,
    productImagePath
  ) {
    this.idProduct = idProduct;
    this.productName = productName;
    this.productAmount = productAmount;
    this.unitPrice = unitPrice;
    this.productImagePath = productImagePath;
  }

  static getAll(db) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT p.idProduct, p.productName, p.productAmount, p.unitPrice FROM FeaturedProduct fp INNER JOIN product p ON p.idProduct = fp.idProduct";

      db.query(query, (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        if (res.length === 0) {
          resolve(null);
          return;
        }

        const featured = res.map((product) => {
          const { idProduct, productName, productAmount, unitPrice } = product;

          return new Featured(idProduct, productName, productAmount, unitPrice);
        });

        resolve(featured);
      });
    });
  }

  static notFeatured(db) {
    return new Promise((resolve, reject) => {
      const query = `SELECT p.idProduct, p.productName, pi.productImagePath FROM Product p INNER JOIN ProductImage pi ON pi.idProduct = p.idProduct 
      WHERE p.idProduct NOT IN (SELECT idProduct FROM FeaturedProduct) GROUP BY p.idProduct`;

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
          const { idProduct, productName, productImagePath } = product;

          return new Featured(
            idProduct,
            productName,
            null,
            null,
            productImagePath
          );
        });

        resolve(products);
      });
    });
  }

  static createFeatured(newFeatured, db) {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO FeaturedProduct (idProduct) VALUES (?)";
      db.query(query, [newFeatured], (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
    });
  }

  static deleteFeatured(db, id) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM FeaturedProduct WHERE idProduct = ?";
      db.query(query, [id], (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
    });
  }
}

module.exports = Featured;
