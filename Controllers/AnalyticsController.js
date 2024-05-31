const Analytic = require("../Models/AnalyticsModel");

const getAll = async (req, res, db) => {
  try {
    const analytics = await Analytic.getAll(req, db);
    return res.status(200).json(analytics);
  } catch (error) {
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

module.exports = { getAll };
