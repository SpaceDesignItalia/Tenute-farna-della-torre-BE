// authcontroller.js

const Staffer = require("../Models/StafferModel");

const login = async (req, res, db) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const staffer = await Staffer.login(req, db, email, password);
    if (!staffer) {
      return res.status(404).json({ error: "Credenziali non valide" });
    }

    // Non inviare la password dell'utente nella risposta
    delete staffer.password;

    // Imposta i dati dell'utente nella sessione
    req.session.staffer = staffer;

    // Restituisci uno stato 200 (OK) e i dati dell'utente
    return res.status(200).json({ staffer });
  } catch (error) {
    console.error("Errore durante il login:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

const GetStafferData = async (req, res, db) => {
  // Verifica se la sessione è stata creata
  if (req.session.staffer) {
    // Verifica se l'utente è autenticato
    return res.status(200).json({ staffer: req.session.staffer });
  } else {
    return res.status(401).json({ error: "Non autorizzato" });
  }
};

const updateStafferData = async (req, res, db) => {
  const stafferData = req.body;

  try {
    const result = await Staffer.updateStafferData(db, stafferData);
    req.session.staffer.name = stafferData.name;
    req.session.staffer.surname = stafferData.surname;
    req.session.staffer.email = stafferData.email;
    req.session.staffer.phone = stafferData.phone;

    return res.status(200).json({ result });
  } catch (error) {
    console.error(
      "Errore durante l'aggiornamento dei dati dello staffer:",
      error
    );
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

const updateStafferPassword = async (req, res, db) => {
  const stafferData = req.body;
  try {
    const result = await Staffer.updateStafferPassword(db, stafferData);
    if (result) {
      req.session.destroy();
    }
    return res.status(200).json({ result });
  } catch (error) {
    console.error(
      "Errore durante l'aggiornamento della password dello staffer:",
      error
    );
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

const CheckSession = async (req, res) => {
  // Verifica se la sessione è stata creata
  if (req.session.staffer) {
    // Verifica se l'utente è autenticato
    res.json(true);
  } else {
    res.json(false);
  }
};

module.exports = {
  login,
  GetStafferData,
  updateStafferData,
  updateStafferPassword,
  CheckSession,
};
