const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const authenticateMiddleware = require("../middlewares/Authmiddleware");

const {
  login,
  GetStafferData,
  updateStafferData,
  updateStafferPassword,
  CheckSession,
} = require("../Controllers/StafferController");
const authRoutes = (db) => {
  // Funzioni per ottenere i dati delgli utenti

  router.get("/CheckSession", async (req, res) => {
    CheckSession(req, res);
  });

  router.get("/GetStafferData", async (req, res) => {
    GetStafferData(req, res, db);
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

  // Funzioni per il login

  router.post("/Login", async (req, res) => {
    login(req, res, db);
  });

  // Funzioni per aggiornare i dati dello staff

  router.put("/UpdateStafferData", authenticateMiddleware, async (req, res) => {
    updateStafferData(req, res, db);
  });

  router.put(
    "/UpdateStafferPassword",
    authenticateMiddleware,
    async (req, res) => {
      updateStafferPassword(req, res, db);
    }
  );
  return router;
};

module.exports = authRoutes;
