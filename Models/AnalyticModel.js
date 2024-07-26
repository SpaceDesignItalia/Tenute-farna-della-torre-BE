class Analytic {
  static async getUsersNumber(db) {
    return new Promise((resolve, reject) => {
      const query = "SELECT COUNT(*) as CustomersNumber FROM customer";
      db.query(query, (err, results) => {
        if (err) {
          console.error("Errore durante la query:", err);
          return reject("Errore interno del server");
        } else {
          return resolve(results);
        }
      });
    });
  }

  static async getStocksNumber(db) {
    return new Promise((resolve, reject) => {
      const query = "SELECT COUNT(*) as StocksNumber FROM product";
      db.query(query, (err, results) => {
        if (err) {
          console.error("Errore durante la query:", err);
          return reject("Errore interno del server");
        } else {
          return resolve(results);
        }
      });
    });
  }

  static async getUsersToVerify(db) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT COUNT(*) as UsersNumber FROM customer WHERE idStatus = 1";
      db.query(query, (err, results) => {
        if (err) {
          console.error("Errore durante la query:", err);
          return reject("Errore interno del server");
        } else {
          return resolve(results);
        }
      });
    });
  }
}

module.exports = Analytic;
