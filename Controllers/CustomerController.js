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

const getCustomersNumber = async (res, db) => {
  try {
    const CustomersNumber = await Customer.CountCustomers(db);

    return res.status(200).json(CustomersNumber);
  } catch {
    console.log("Errore durante il recupero dei dati:", error);
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

const register = async (req, res, db) => {
  const { name, surname, phone, mail, password } = req.body;

  try {
    // Verifica se l'email è già associata a un altro account

    const newUser = await Customer.register(db, {
      name,
      surname,
      phone,
      mail,
      password,
    });

    // Restituisci lo stato 201 (Creato) e i dati dell'utente registrato
    return res.status(201).json({ newUser });
  } catch (error) {
    console.error("Errore durante la registrazione:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

const updateCustomerStatus = async (req, res, db) => {
  const idStatus = req.body.idStatus;
  const idCustomer = req.params.id;

  try {
    const result = await Customer.UpdateStatus(db, idStatus, idCustomer);
    return res.status(200).json({ result });
  } catch (error) {
    console.error(
      "Errore durante l'aggiornamento dei dati del cliente:",
      error
    );
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

const GetCustomerData = async (req, res, db) => {
  // Verifica se la sessione è stata creata
  if (req.session.customer) {
    // Verifica se l'utente è autenticato
    return res.status(200).json({ customer: req.session.customer });
  } else {
    return res.status(401).json({ error: "Non autorizzato" });
  }
};

const CheckSession = async (req, res) => {
  // Verifica se la sessione è stata creata
  if (req.session.customer) {
    // Verifica se l'utente è autenticato
    res.status(200).json(true);
  } else {
    res.json(false);
  }
};

const logout = async (req, res) => {
  try {
    // Distruggi la sessione
    req.session.destroy((err) => {
      if (err) {
        console.error("Errore durante il logout:", err);
        return res.status(500).json({ error: "Errore interno del server" });
      }
      // Se la sessione è stata distrutta con successo, restituisci uno stato 200 (OK)
      return res
        .status(200)
        .json({ message: "Logout effettuato con successo" });
    });
  } catch (error) {
    console.error("Errore durante il logout:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

const updateCustomerData = async (req, res, db) => {
  const userData = req.body;

  console.log(userData);
  try {
    const result = await Customer.updateCustomerData(db, userData);
    req.session.customer.name = userData.name;
    req.session.customer.surname = userData.surname;
    req.session.customer.email = userData.email;
    req.session.customer.phone = userData.phone;

    return res.status(200).json({ result });
  } catch (error) {
    console.error(
      "Errore durante l'aggiornamento dei dati del cliente:",
      error
    );
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

const updateCustomerPassword = async (req, res, db) => {
  const userData = req.body;
  try {
    const result = await Customer.updateCustomerPassword(db, userData);
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

module.exports = {
  getAll,
  getCustomerById,
  getImagesByCustomerId,
  getCustomersNumber,
  login,
  register,
  updateCustomerStatus,
  GetCustomerData,
  CheckSession,
  logout,
  updateCustomerData,
  updateCustomerPassword,
};
