class Discount {
  constructor(
    idDiscount,
    discountCode,
    idDiscountType,
    typeName,
    value,
    startDate,
    endDate
  ) {
    this.idDiscount = idDiscount;
    this.discountCode = discountCode;
    this.idDiscountType = idDiscountType;
    this.typeName = typeName;
    this.value = value;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  static async getAll(db) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT * FROM discountcode dc INNER JOIN discounttype dt ON dc.idDiscountType = dt.idDiscountType";

      db.query(query, (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        if (res.length === 0) {
          resolve(null);
          return;
        }

        const discounts = res.map((discount) => {
          const {
            idDiscount,
            discountCode,
            idDiscountType,
            typeName,
            value,
            startDate,
            endDate,
          } = discount;

          return new Discount(
            idDiscount,
            discountCode,
            idDiscountType,
            typeName,
            value,
            startDate,
            endDate
          );
        });

        resolve(discounts);
      });
    });
  }

  static async getAllCodes(db) {
    return new Promise((resolve, reject) => {
      const query = "SELECT discountCode FROM discountcode";

      db.query(query, (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        if (res.length === 0) {
          resolve(null);
          return;
        }

        const discounts = res.map((discount) => {
          const { discountCode } = discount;

          return new Discount(discountCode);
        });

        resolve(discounts);
      });
    });
  }

  static async getDiscountByCode(db, code) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT * FROM discountcode dc INNER JOIN discounttype dt ON dc.idDiscountType = dt.idDiscountType WHERE discountCode LIKE ?";

      db.query(query, [`%${code}%`], (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        if (res.length === 0) {
          resolve(null);
          return;
        }

        const discount = res.map((discount) => {
          const {
            idDiscount,
            discountCode,
            idDiscountType,
            typeName,
            value,
            startDate,
            endDate,
          } = discount;

          return new Discount(
            idDiscount,
            discountCode,
            idDiscountType,
            typeName,
            value,
            startDate,
            endDate
          );
        });

        resolve(discount);
      });
    });
  }

  static async getDiscountDataById(db, idDiscount) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT * FROM discountcode dc INNER JOIN discounttype dt ON dc.idDiscountType = dt.idDiscountType WHERE idDiscount = ?";

      db.query(query, [idDiscount], (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        if (res.length === 0) {
          resolve(null);
          return;
        }

        const discount = res.map((discount) => {
          const {
            idDiscount,
            discountCode,
            idDiscountType,
            typeName,
            value,
            startDate,
            endDate,
          } = discount;

          return new Discount(
            idDiscount,
            discountCode,
            idDiscountType,
            typeName,
            value,
            startDate,
            endDate
          );
        });

        resolve(discount);
      });
    });
  }

  static async getDiscountProductsById(db, idDiscount) {
    return new Promise((resolve, reject) => {
      const query = `SELECT p.idProduct, p.productName, pi.productImagePath
      FROM product p INNER JOIN productimage pi ON p.idProduct = pi.idProduct
      INNER JOIN productdiscount pd ON p.idProduct = pd.idProduct
      INNER JOIN discountcode dc ON pd.idDiscount = dc.idDiscount
      WHERE pd.idDiscount = ? GROUP BY p.idProduct`;

      db.query(query, [idDiscount], (err, res) => {
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

          return {
            idProduct,
            productName,
            productImagePath,
          };
        });

        resolve(products);
      });
    });
  }

  static async getProductsWithoutDiscount(db, idProduct) {
    return new Promise((resolve, reject) => {
      const query = `SELECT p.idProduct, p.productName, pi.productImagePath
      FROM product p INNER JOIN productimage pi ON p.idProduct = pi.idProduct
      LEFT JOIN productdiscount pd ON p.idProduct = pd.idProduct
      WHERE pd.idProduct IS NULL GROUP BY p.idProduct`;

      db.query(query, [idProduct], (err, res) => {
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

          return {
            idProduct,
            productName,
            productImagePath,
          };
        });

        resolve(products);
      });
    });
  }

  static checkDiscountCodeValidity(db, discountCode, idCustomer) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM discountcode dc WHERE dc.discountCode = ?
      AND (dc.endDate IS NULL OR dc.endDate > CURDATE())
      AND NOT EXISTS (
        SELECT 1 
        FROM productdiscount pd 
        WHERE pd.idDiscount = dc.idDiscount
      )
      AND NOT EXISTS (
        SELECT 1 
        FROM orderdetails od 
        WHERE od.idDiscount = dc.idDiscount AND idCustomer = ?
      );`;

      db.query(query, [discountCode, idCustomer], (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }

  static createDiscount(discount, db) {
    return new Promise((resolve, reject) => {
      if (discount.assignedProducts) {
        const discountCode = discount.discountCode
          ? discount.discountCode
          : null;
        const endDate = discount.discountEnd ? discount.discountEnd : null;

        const queryInsert =
          "INSERT INTO discountcode (discountCode, idDiscountType, value, startDate, endDate) VALUES (?, ?, ?, ?, ?)";
        db.query(
          queryInsert,
          [
            discountCode,
            discount.discountType,
            discount.discountValue,
            discount.discountStart,
            endDate,
          ],
          (err, resInsert) => {
            if (err) {
              reject(err);
              return;
            }
            console.log("Inserted ID:", resInsert.insertId); // Stampa l'ID inserito

            discount.assignedProducts.forEach((element) => {
              console.log("New Discount ID:", resInsert.insertId);
              const newDiscountId = resInsert.insertId;

              const query =
                "INSERT INTO productdiscount (idProduct, idDiscount) VALUES (?, ?)";
              db.query(query, [element, newDiscountId], (err, res) => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(res);
              });
            });
          }
        );
      } else {
        const discountCode = discount.discountCode
          ? discount.discountCode
          : null;

        const endDate = discount.discountEnd ? discount.discountEnd : null;
        const query =
          "INSERT INTO discountcode (discountCode, idDiscountType, value, startDate, endDate) VALUES (?, ?, ?, ?, ?)";

        db.query(
          query,
          [
            discountCode,
            discount.discountType,
            discount.discountValue,
            discount.discountStart,
            endDate,
          ],
          (err, res) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(res);
          }
        );
      }
    });
  }

  static async deleteDiscount(idDiscount, db) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM discountcode WHERE idDiscount = ?";

      db.query(query, [idDiscount], (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
    });
  }
}

module.exports = Discount;
