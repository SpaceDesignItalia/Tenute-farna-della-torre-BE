const Customer = require("../Models/CustomerModel");
const sendRecoverMail = require("../middlewares/mailSender");
const otpGenerator = require("otp-generator");

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
    return res.status(200).json(req.session.customer);
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

let storedOTP = null;

const SendOTP = async (req, res, db) => {
  const email = req.body.email;

  try {
    const emailExists = await Customer.sendOTP(db, email);

    if (!emailExists) {
      return res.status(404).json({ error: "Email non presente" });
    } else {
      // Genera un codice OTP
      const generatedOTP = otpGenerator.generate(8, {
        digits: true,
        alphabets: false,
        upperCase: false,
        specialChars: false,
      });

      console.log(generatedOTP);
      storedOTP = generatedOTP;

      // Costruisci il token incorporando il codice OTP
      const token = `${generatedOTP}`;

      sendRecoverMail(email, emailExists.name, emailExists.surname, token);

      // Passa il token come parametro nella risposta JSON
      return res
        .status(200)
        .json({ message: "Email inviata", token, storedOTP });
    }
  } catch (error) {
    console.error("Errore durante l'invio dell'OTP:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

const checkOTP = async (req, res) => {
  const sentToken = req.params.token;

  console.log(storedOTP, sentToken);

  if (storedOTP && sentToken) {
    if (sentToken === storedOTP) {
      return res.status(200).json({ message: "OTP corretto" });
    }
  }

  return res.status(404).json({ error: "OTP non corretto" });
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
  SendOTP,
  checkOTP,
  logout,
};
