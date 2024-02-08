const bcrypt = require("bcrypt");

class Customer {
  constructor(name, surname, phone, email) {
    this.name = name;
    this.surname = surname;
    this.phone = phone;
    this.email = email;
  }

  static async login(req, db, email, password) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT idCustomer, name, surname, phone, mail, password FROM customer WHERE mail = ?",
        [email],
        async (err, results) => {
          if (err) {
            console.error("Errore durante la query:", err);
            return reject("Errore interno del server");
          } else {
            if (results.length === 1) {
              try {
                const isPasswordValid = await bcrypt.compare(
                  password,
                  results[0].password
                );

                if (isPasswordValid) {
                  const user = {
                    id: results[0].idCustomer,
                    name: results[0].name,
                    surname: results[0].surname,
                    phone: results[0].phone,
                    email: results[0].mail,
                  };

                  return resolve(user);
                } else {
                  return reject(false);
                }
              } catch (compareError) {
                console.error(
                  "Errore durante la comparazione della password:",
                  compareError
                );
                return reject(false);
              }
            } else {
              // L'autenticazione non è riuscita
              return reject(false);
            }
          }
        }
      );
    });
  }
}

module.exports = Customer;
