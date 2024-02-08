// authcontroller.js

const Customer = require("../Models/CustomerModel");

const login = async (req, res, db) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const customer = await Customer.login(req, db, email, password);
    if (!customer) {
      return res.status(404).json({ error: "Credenziali non valide" });
    }

    // Non inviare la password dell'utente nella risposta
    delete customer.password;

    // Imposta i dati dell'utente nella sessione
    req.session.customer = customer;

    // Restituisci uno stato 200 (OK) e i dati dell'utente
    return res.status(200).json({ customer });
  } catch (error) {
    console.error("Errore durante il login:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

const GetCustomerData = async (req, res, db) => {
  // Verifica se la sessione è stata creata
  if (req.session.customer) {
    // Verifica se l'utente è autenticato
    return res.status(200).json(req.session.customer);
  } else {
    return res.status(401).json({ error: "Non autorizzato" });
  }
};

const CheckSession = async (req, res) => {
  // Verifica se la sessione è stata creata
  if (req.session.customer) {
    // Verifica se l'utente è autenticato
    res.json(true);
  } else {
    res.json(false);
  }
};

module.exports = {
  login,
  GetCustomerData,
  CheckSession,
};
