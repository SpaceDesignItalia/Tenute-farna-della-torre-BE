class Analytic {
  static async getAnalytics(db) {
    return new Promise((resolve, reject) => {
      const analytics = [];
      const query = "SELECT COUNT(*) AS Products FROM product";
      db.query(query, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
}
