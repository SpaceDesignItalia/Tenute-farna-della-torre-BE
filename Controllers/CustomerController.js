// authcontroller.js

const Customer = require("../Models/CustomerModel");

const getAll = async (req, res, db) => {
  try {
    const customers = await Customer.getAll(req, db);
    return res.status(200).json(customers);
  } catch (error) {
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

const getCustomerById = async (req, res, db) => {
  const id = req.params.id;

  try {
    const customer = await Customer.getCustomerById(db, id);
    if (!customer) {
      return res.status(404).json({ error: "Cliente non trovato" });
    }

    return res.status(200).json(customer);
  } catch (error) {
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

const getImagesByCustomerId = async (req, res, db) => {
  const id = req.params.id;

  try {
    const images = await Customer.GetImagesByCustomerId(db, id);
    if (!images) {
      return res.status(404).json({ error: "Immagini non presenti" });
    }
    return res.status(200).json(images);
  } catch (error) {
    console.error("Errore durante il recupero dei dati:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

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
  getAll,
  getCustomerById,
  getImagesByCustomerId,
  login,
  GetCustomerData,
  CheckSession,
};
