const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const authenticateMiddleware = require("../middlewares/auth");
const e = require("express");

const authRoutes = (db) => {
  router.post("/Login", (req, res) => {
    const { email, password } = req.body;

    console.log(email);

    db.query(
      "SELECT id, nome, cognome, mail, password FROM utente WHERE mail = ?",
      [email],
      async (err, results) => {
        if (err) {
          console.error("Errore durante la query:", err);
          return res.status(500).json({ error: "Errore interno del server" });
        } else {
          if (results.length === 1) {
            try {
              const isPasswordValid = await bcrypt.compare(
                password,
                results[0].password
              );

              if (isPasswordValid) {
                console.log("Password corretta");
                req.session.user = results[0];
                // Save user data in the session
                return res.sendStatus(200);
              } else {
                console.log("Password errata");
                return res.sendStatus(401);
              }
            } catch (compareError) {
              console.error(
                "Errore durante la comparazione della password:",
                compareError
              );
              return res
                .status(500)
                .json({ error: "Errore interno del server" });
            }
          } else {
            // Authentication failed
            return res.sendStatus(401);
          }
        }
      }
    );
  });

  router.get("/Logout", (req, res) => {
    if (req.session) {
      if (req.session.user) {
        req.session.destroy((destroyErr) => {
          if (destroyErr) {
            console.error(
              "Errore durante la distruzione della sessione:",
              destroyErr
            );
            return res.status(500).json({ error: "Errore interno del server" });
          } else {
            return res.sendStatus(200);
          }
        });
      }
    }
  });

  router.get("/GetUserData", authenticateMiddleware, (req, res) => {
    if (req.session) {
      if (req.session.user) {
        res.send(req.session.user);
      }
    }
  });

  router.put("/UpdateUserData", authenticateMiddleware, (req, res) => {
    const { Name, Surname, Email, Pfp, Id } = req.body;
    db.query(
      "UPDATE Users SET Name = ?, Surname = ?, Email = ? , Pfp = ? WHERE ID = ?",
      [Name, Surname, Email, Pfp, Id],
      (err, results) => {
        if (err) {
          console.error("Errore durante la query:", err);
          return res.status(500).json({ error: "Errore interno del server" });
        } else {
          if (results.affectedRows === 1) {
            // Aggiornamento riuscito
            req.session.destroy;
            return res.sendStatus(200);
          } else {
            // Aggiornamento fallito
            return res.sendStatus(401);
          }
        }
      }
    );
  });

  router.put(
    "/UpdateUserPassword",
    authenticateMiddleware,
    async (req, res) => {
      const { Email, Password, Id } = req.body;

      try {
        const encryptedPassword = await bcrypt.hash(Password, 10);

        db.query(
          "UPDATE Users SET Password = ? WHERE ID = ? AND Email = ?",
          [encryptedPassword, Id, Email],
          (err, results) => {
            if (err) {
              console.error("Errore durante la query:", err);
              return res
                .status(500)
                .json({ error: "Errore interno del server" });
            } else {
              if (results.changedRows === 1) {
                // Aggiornamento riuscito
                req.session.destroy((destroyErr) => {
                  if (destroyErr) {
                    console.error(
                      "Errore durante la distruzione della sessione:",
                      destroyErr
                    );
                    return res
                      .status(500)
                      .json({ error: "Errore interno del server" });
                  } else {
                    return res.sendStatus(200);
                  }
                });
              } else {
                // Nessuna modifica effettuata o errore nell'aggiornamento
                return res.sendStatus(401);
              }
            }
          }
        );
      } catch (hashError) {
        console.error("Errore durante l'hash della password:", hashError);
        return res.status(500).json({ error: "Errore interno del server" });
      }
    }
  );

  router.get("/CheckSession", (req, res) => {
    // Verifica se la sessione è stata creata
    if (req.session.user) {
      // Verifica se l'utente è autenticato (puoi adattare questa logica)
      if (req.session.user) {
        res.send(true);
      } else {
        res.send(false);
      }
    } else {
      res.send(false);
    }
  });

  router.get("/ConvertPassword/:password", (req, res) => {
    const { password } = req.params;

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error("Errore durante l'hash della password:", err);
        return res.status(500).json({ error: "Errore interno del server" });
      } else {
        return res.send(
          "<h1>SOLO IN CASO DI EMERGENZA</h1><h2>Questa stringa verrà inserita manualmente dall'amministratore di sistema</h2><p><b>Password inserita: </b>" +
            password +
            "</p><p><b>Password convertita:</b> " +
            hash +
            "</p>"
        );
      }
    });
  });

  return router;
};

module.exports = authRoutes;
