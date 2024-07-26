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
      const query = `SELECT DISTINCT p.idProduct, p.productName, p.productDescription, p.productAmount ,p.unitPrice, dc.value, dc.idDiscountType, pi.productImagePath FROM featuredproduct fp
      INNER JOIN product p ON p.idProduct = fp.idProduct
      LEFT JOIN productdiscount pd ON p.idProduct = pd.idProduct
      LEFT JOIN discountcode dc ON pd.idDiscount = dc.idDiscount
      INNER JOIN (SELECT idProduct, MIN(productImagePath) AS productImagePath FROM productimage GROUP BY idProduct) pi ON p.idProduct = pi.idProduct;`;

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
          return {
            idProduct: product.idProduct,
            productName: product.productName,
            productDescription: product.productDescription,
            productAmount: product.productAmount,
            unitPrice: product.unitPrice,
            value: product.value,
            idDiscountType: product.idDiscountType,
            productImagePath: product.productImagePath,
          };
        });

        resolve(featured);
      });
    });
  }

  static notFeatured(db) {
    return new Promise((resolve, reject) => {
      const query = `SELECT p.idProduct, p.productName, pi.productImagePath FROM Product p INNER JOIN ProductImage pi ON pi.idProduct = p.idProduct 
      WHERE p.idProduct NOT IN (SELECT idProduct FROM featuredproduct) GROUP BY p.idProduct`;

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

  static findByName(name, db) {
    return new Promise((resolve, reject) => {
      const query = `SELECT p.idProduct, p.productName, p.productAmount, p.unitPrice FROM featuredproduct fp INNER JOIN product p ON p.idProduct = fp.idProduct WHERE p.productName LIKE ?`;

      db.query(query, [`%${name}%`], (err, res) => {
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

  static createFeatured(newFeatured, db) {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO featuredproduct (idProduct) VALUES (?)";
      db.query(query, [newFeatured], (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
    });
  }

  static deleteFeatured(id, db) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM featuredproduct WHERE idProduct = ?";
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
