// analyticModel.js
const Analytic = require("../Models/AnalyticModel");
const getUsersNumber = async (res, db) => {
  try {
    const analytic = await Analytic.getUsersNumber(db);
    if (!analytic) {
      return res.status(404).json({ error: "Utenti non trovati" });
    }
    // Restituisci uno stato 200 (OK) e i dati dell'utente
    return res.status(200).json({ analytic });
  } catch (error) {
    console.error("Errore durante il recupero dei dati:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

const getStocksNumber = async (res, db) => {
  try {
    const analytic = await Analytic.getStocksNumber(db);
    if (!analytic) {
      return res.status(404).json({ error: "Prodotti non trovati" });
    }
    // Restituisci uno stato 200 (OK) e i dati dell'utente
    return res.status(200).json({ analytic });
  } catch (error) {
    console.error("Errore durante il recupero dei dati:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

module.exports = { getUsersNumber, getStocksNumber };
