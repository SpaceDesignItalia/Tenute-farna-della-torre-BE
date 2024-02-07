const bcrypt = require("bcrypt");

class Staffer {
  constructor(name, surname, phone, email) {
    this.name = name;
    this.surname = surname;
    this.phone = phone;
    this.email = email;
  }

  static async login(req, db, email, password) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT idStaffer, name, surname, phone, mail, password FROM staffer WHERE mail = ?",
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
                    id: results[0].idStaffer,
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

  static async updateStafferData(db, stafferData) {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE staffer SET name = ?, surname = ?, phone = ?, mail = ? WHERE idStaffer = ?",
        [
          stafferData.name,
          stafferData.surname,
          stafferData.phone,
          stafferData.email,
          stafferData.id,
        ],
        (err, results) => {
          if (err) {
            console.error("Errore durante l'aggiornamento dei dati:", err);
            return reject("Errore interno del server");
          } else {
            if (results.affectedRows === 1) {
              return resolve(true);
            } else {
              return reject(false);
            }
          }
        }
      );
    });
  }

  static async updateStafferPassword(db, stafferData) {
    return new Promise((resolve, reject) => {
      const passwordEncrypted = bcrypt.hashSync(stafferData.password, 10);
      const query = "SELECT password FROM staffer WHERE idStaffer = ?";
      db.query(
        query,
        [stafferData.id, stafferData.password],
        (err, results) => {
          if (err) {
            console.error("Errore durante la query:", err);
            return reject("Errore interno del server");
          } else {
            if (bcrypt.compare(stafferData.password, results[0].password)) {
              console.log(passwordEncrypted);
              db.query(
                "UPDATE staffer SET password = ? WHERE idStaffer = ?",
                [passwordEncrypted, stafferData.id],
                (err, results) => {
                  if (err) {
                    console.error(
                      "Errore durante l'aggiornamento della password:",
                      err
                    );
                    return reject("Errore interno del server");
                  } else {
                    if (results.affectedRows === 1) {
                      return resolve(true);
                    } else {
                      return reject(false);
                    }
                  }
                }
              );
            } else {
              return reject(false);
            }
          }
        }
      );
    });
  }
}

module.exports = Staffer;
