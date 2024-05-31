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
}

module.exports = Analytic;
