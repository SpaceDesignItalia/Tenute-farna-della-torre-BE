const bcrypt = require("bcrypt");

class Customer {
  constructor(name, surname, phone, email) {
    this.name = name;
    this.surname = surname;
    this.phone = phone;
    this.email = email;
  }

  static async getAll(req, db) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT c.idCustomer, c.name, c.surname, c.mail, c.phone, cs.idStatus, cs.statusName FROM customer c INNER JOIN customerstatus cs on c.idStatus = cs.idStatus";
      db.query(query, (err, results) => {
        if (err) {
          console.error("Errore durante la query:", err);
          return reject("Errore interno del server");
        } else {
          const customers = results.map((customer) => {
            return {
              id: customer.idCustomer,
              name: customer.name,
              surname: customer.surname,
              mail: customer.mail,
              phone: customer.phone,
              idStatus: customer.idStatus,
              status: customer.statusName,
            };
          });
          return resolve(customers);
        }
      });
    });
  }

  static async getAllShippingInfo(db, customerId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT csd.idShippingDetail, csd.name, csd.address, csd.civicNumber, csd.cap, csd.city, csd.province, csd.nation FROM customershippingdetail csd INNER JOIN shippinginfo si ON csd.idShippingDetail = si.idShippingDetail WHERE si.idCustomer = ?`;
      db.query(query, [customerId], (err, results) => {
        if (err) {
          console.error(
            "Errore durante la query per ottenere le informazioni di spedizione:",
            err
          );
          return reject("Errore interno del server");
        } else {
          const shippingInfo = results.map((info) => ({
            id: info.idShippingDetail,
            name: info.name,
            address: info.address,
            civicNumber: info.civicNumber,
            cap: info.cap,
            city: info.city,
            province: info.province,
            nation: info.nation,
          }));
          return resolve(shippingInfo);
        }
      });
    });
  }

  static async getCustomerById(db, id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT c.idCustomer, c.name, c.surname, c.mail, c.phone, cs.idStatus, cs.statusName, dt.documentType FROM customer c
      LEFT JOIN customerstatus cs on c.idStatus = cs.idStatus
      LEFT JOIN customerdocument cd ON c.idCustomer = cd.idCustomer
      LEFT JOIN documenttype dt ON cd.idDocumentType = dt.idDocumentType
      WHERE c.idCustomer = ? LIMIT 1
      `;
      db.query(query, [id], (err, results) => {
        if (err) {
          console.error("Errore durante la query:", err);
          return reject("Errore interno del server");
        } else {
          if (results.length === 1) {
            const customer = {
              id: results[0].idCustomer,
              name: results[0].name,
              surname: results[0].surname,
              mail: results[0].mail,
              phone: results[0].phone,
              idStatus: results[0].idStatus,
              status: results[0].statusName,
              documentType: results[0].documentType,
            };

            return resolve(customer);
          } else {
            return reject("Cliente non trovato");
          }
        }
      });
    });
  }

  static async GetImagesByCustomerId(db, id) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT idDocument, idCustomer, documentPath FROM customerdocument WHERE idCustomer = ?";
      db.query(query, [id], (err, results) => {
        if (err) {
          console.error("Errore durante la query:", err);
          return reject("Errore interno del server");
        } else {
          const images = results.map((customer) => {
            return (customer = {
              idDocument: customer.idDocument,
              idCustomer: customer.idCustomer,
              documentPath: customer.documentPath,
            });
          });

          resolve(images);
        }
      });
    });
  }

  static async CountCustomers(db) {
    return new Promise((resolve, reject) => {
      const query = "SELECT COUNT(*) AS nCustomers FROM customer";
      db.query(query, (err, results) => {
        if (err) {
          console.log("Errore durante la query", err);
          return reject("Errore interno del server");
        } else {
          const CustomerNumber = {
            name: "Clienti registrati",
            stats: results[0].nCustomers,
          };
          return resolve(CustomerNumber);
        }
      });
    });
  }

  static async login(req, db, email, password) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT idCustomer, name, surname, phone, mail, password FROM customer WHERE mail = ?";
      db.query(query, [email], async (err, results) => {
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
      });
    });
  }

  static async register(db, newUserData) {
    return new Promise((resolve, reject) => {
      const { name, surname, phone, mail, password } = newUserData;
      const query = "SELECT * FROM customer WHERE mail = ?";
      db.query(query, [mail], (error, results) => {
        if (results.length === 1) {
          return reject("Account esistente");
        } else {
          bcrypt.hash(password, 10, (hashError, hashedPassword) => {
            if (hashError) {
              console.error(
                "Errore durante l'hashing della password:",
                hashError
              );
              return reject("Errore interno del server");
            }
            const query =
              "INSERT INTO customer (name, surname, phone, mail, password) VALUES (?, ?, ?, ?, ?)";
            db.query(
              query,
              [name, surname, phone, mail, hashedPassword],
              (insertError, results) => {
                if (insertError) {
                  console.error(
                    "Errore durante l'inserimento nel database:",
                    insertError
                  );
                  return reject("Errore interno del server");
                }
                const userId = results.insertId;
                const newUser = {
                  id: userId,
                  name: name,
                  surname: surname,
                  phone: phone,
                  email: mail,
                };
                resolve(newUser);
              }
            );
          });
        }
      });
    });
  }

  static async addShippingInfo(
    db,
    customerId,
    name,
    address,
    civicNumber,
    cap,
    city,
    province,
    nation
  ) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO customershippingdetail (name, address, civicNumber, cap, city, province, nation) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      db.query(
        query,
        [name, address, civicNumber, cap, city, province, nation],
        (err, results) => {
          if (err) {
            console.error(
              "Errore durante l'inserimento delle informazioni di spedizione:",
              err
            );
            return reject("Errore interno del server");
          } else {
            const shippingDetailId = results.insertId;
            const linkQuery = `INSERT INTO shippinginfo (idCustomer, idShippingDetail) VALUES (?, ?)`;
            db.query(
              linkQuery,
              [customerId, shippingDetailId],
              (linkErr, linkResults) => {
                if (linkErr) {
                  console.error(
                    "Errore durante l'associazione delle informazioni di spedizione al cliente:",
                    linkErr
                  );
                  return reject("Errore interno del server");
                } else {
                  return resolve(
                    "Informazioni di spedizione aggiunte con successo"
                  );
                }
              }
            );
          }
        }
      );
    });
  }

  static async loadDocument(db, idCustomer, idDocumentType, documents) {
    return new Promise((resolve, reject) => {
      // Verifica se il prodotto è stato inserito correttamente

      // Query per inserire l'immagine del prodotto nella tabella productImage
      const insertDocumentQuery =
        "INSERT INTO CustomerDocument (idCustomer, idDocumentType, documentPath) VALUES (?, ?, ?)";

      documents.forEach((document) => {
        db.query(
          insertDocumentQuery,
          [idCustomer, idDocumentType, document.filename],
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
    });
  }

  static async UpdateStatus(db, idStatus, idCustomer) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE customer SET idStatus = ? WHERE idCustomer = ?";
      db.query(query, [idStatus, idCustomer], (err, results) => {
        if (err) {
          console.error("Errore durante l'aggiornamento dei dati:", err);
          return reject("Errore interno del server");
        } else {
          if (results.affectedRows === 1) {
            resolve(true);
          } else {
            return reject(false);
          }
        }
      });
    });
  }

  static async updateShippingInfo(
    db,
    name,
    address,
    civicNumber,
    cap,
    city,
    province,
    nation,
    idShippingDetail
  ) {
    return new Promise((resolve, reject) => {
      const updateQuery =
        "UPDATE customershippingdetail SET name = ?, address = ?, civicNumber = ?, cap = ?, city = ?, province = ?, nation = ? WHERE idShippingDetail = ?";

      db.query(
        updateQuery,
        [
          name,
          address,
          civicNumber,
          cap,
          city,
          province,
          nation,
          idShippingDetail,
        ],
        (updateErr, updateResults) => {
          if (updateErr) {
            console.error(
              "Errore durante l'aggiornamento delle informazioni di spedizione:",
              updateErr
            );
            return reject("Errore interno del server");
          } else {
            return resolve(
              "Informazioni di spedizione aggiornate con successo"
            );
          }
        }
      );
    });
  }

  static async deleteShippingInformations(db, idCustomer, idShippingDetail) {
    return new Promise((resolve, reject) => {
      const deleteQuery = `DELETE FROM shippinginfo WHERE idCustomer = ? AND idShippingDetail = ?`;

      db.query(
        deleteQuery,
        [idCustomer, idShippingDetail],
        (deleteErr, deleteResults) => {
          if (deleteErr) {
            console.error(
              "Errore durante l'eliminazione delle informazioni di spedizione:",
              deleteErr
            );
            return reject("Errore interno del server");
          } else {
            const deleteShippingDetailQuery = `DELETE FROM customershippingdetail WHERE idShippingDetail = ?`;

            db.query(
              deleteShippingDetailQuery,
              [idShippingDetail],
              (deleteShippingDetailErr, deleteShippingDetailResults) => {
                if (deleteShippingDetailErr) {
                  console.error(
                    "Errore durante l'eliminazione delle informazioni di spedizione:",
                    deleteShippingDetailErr
                  );
                  return reject("Errore interno del server");
                } else {
                  return resolve(
                    "Informazioni di spedizione eliminate con successo"
                  );
                }
              }
            );
          }
        }
      );
    });
  }

  static async sendOTP(db, email) {
    return new Promise((resolve, reject) => {
      const query = "SELECT surname, name FROM customer WHERE mail = ?";
      db.query(query, [email], async (err, results) => {
        if (err) {
          console.error("Errore durante la query:", err);
          return reject("Errore interno del server");
        }

        if (results.length !== 1) {
          return reject("Nessun utente trovato con questa email");
        }

        const user = results[0];
        const { name, surname } = user;
        return resolve({ name, surname, email });
      });
    });
  }

  static async setDefaultShippingInfo(db, customerId, idShippingDetail) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE shippinginfo SET isDefault = 1 WHERE idCustomer = ? AND idShippingDetail = ?`;
      const resetQuery = `UPDATE shippinginfo SET isDefault = 0 WHERE idCustomer = ? AND idShippingDetail != ?`;

      db.query(query, [customerId, idShippingDetail], (err, results) => {
        if (err) {
          console.error(
            "Errore durante l'aggiornamento delle informazioni di spedizione:",
            err
          );
          return reject("Errore interno del server");
        } else {
          if (results.affectedRows === 1) {
            return resolve(
              "Informazioni di spedizione aggiornate con successo"
            );
          } else {
            return reject("Informazioni di spedizione non aggiornate");
          }
        }
      });
      db.query(resetQuery, [customerId, idShippingDetail], (err, results) => {
        if (err) {
          console.error(
            "Errore durante l'aggiornamento delle informazioni di spedizione:",
            err
          );
          return reject("Errore interno del server");
        } else {
          if (results.affectedRows === 1) {
            return resolve(
              "Informazioni di spedizione aggiornate con successo"
            );
          } else {
            return reject("Informazioni di spedizione non aggiornate");
          }
        }
      });
    });
  }

  static async isDefaultShippingInfo(db, customerId, idShippingDetail) {
    return new Promise((resolve, reject) => {
      const query = `SELECT isDefault FROM shippinginfo WHERE idShippingDetail = ? AND idCustomer = ?`;

      db.query(
        query,
        [idShippingDetail, customerId],

        (err, results) => {
          if (err) {
            console.error(
              "Errore durante il recupero delle informazioni di spedizione:",
              err
            );
            return reject("Errore interno del server");
          } else {
            if (results.length === 1) {
              return resolve(results[0].isDefault);
            } else {
              return reject("Informazioni di spedizione non trovate");
            }
          }
        }
      );
    });
  }

  static async updateCustomerData(db, userData) {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE customer SET name = ?, surname = ?, phone = ?, mail = ? WHERE idCustomer = ?",
        [
          userData.name,
          userData.surname,
          userData.phone,
          userData.email,
          userData.id,
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

  static async updateCustomerPassword(db, customerData) {
    return new Promise((resolve, reject) => {
      const passwordEncrypted = bcrypt.hashSync(customerData.password, 10);
      const query = "SELECT password FROM customer WHERE id = ?";
      db.query(query, [customerData.id], (err, results) => {
        if (err) {
          console.error("Errore durante la query:", err);
          return reject("Errore interno del server");
        } else {
          if (results.length === 1 && results[0].password) {
            bcrypt.compare(
              customerData.password,
              results[0].password,
              function (err, result) {
                if (err) {
                  console.error(
                    "Errore durante la comparazione della password:",
                    err
                  );
                  return reject("Errore interno del server");
                }

                if (result === false) {
                  db.query(
                    "UPDATE customer SET password = ? WHERE id = ?",
                    [passwordEncrypted, customerData.id],
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
                  return reject(
                    "La password inserita è uguale a quella attuale"
                  );
                }
              }
            );
          } else {
            return reject("Utente non trovato o password non disponibile");
          }
        }
      });
    });
  }

  static async updateCustomerPasswordEmail(db, customerData) {
    return new Promise((resolve, reject) => {
      const passwordEncrypted = bcrypt.hashSync(customerData.password, 10);
      const query = "SELECT password FROM customer WHERE mail = ?";
      db.query(query, [customerData.email], (err, results) => {
        if (err) {
          console.error("Errore durante la query:", err);
          return reject("Errore interno del server");
        } else {
          if (results.length === 1) {
            bcrypt.compare(
              customerData.password,
              results[0].password,
              function (err, result) {
                if (err) {
                  console.error(
                    "Errore durante la comparazione della password:",
                    err
                  );
                  return reject("Errore interno del server");
                }

                if (result === false) {
                  db.query(
                    "UPDATE customer SET password = ? WHERE mail = ?",
                    [passwordEncrypted, customerData.email],
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
                  return reject(
                    "La password inserita è uguale a quella attuale"
                  );
                }
              }
            );
          } else {
            return reject("Utente non trovato o password non disponibile");
          }
        }
      });
    });
  }
}

module.exports = Customer;
