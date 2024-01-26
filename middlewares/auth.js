function authenticateMiddleware(req, res, next) {
  if (req.session && req.session.user) {
    // L'utente è autenticato, procedi
    next();
  } else {
    res.status(401).json({ message: "Accesso non autorizzato" });
  }
}

module.exports = authenticateMiddleware;
