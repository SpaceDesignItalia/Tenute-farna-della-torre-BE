const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/Documents/"); // Specifica la directory di destinazione dei file caricati
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + file.originalname); // Specifica il nome del file caricato
  },
});
const upload = multer({ storage: storage });

const {
  getAll,
  getAllShipping,
  getShippingInfoById,
  getCustomerById,
  getImagesByCustomerId,
  getCustomersNumber,
  login,
  register,
  addShippingInfo,
  updateCustomerStatus,
  GetCustomerData,
  CheckSession,
  SendOTP,
  checkOTP,
  logout,
  setDefaultShipping,
  updateCustomerData,
  updateCustomerPassword,
  updateCustomerPasswordEmail,
  DeleteAccount,
  deleteShippingInfo,
  loadDocument,
  isDefault,
  updateShippingDetail,
  getCustomerByEmail,
} = require("../Controllers/CustomerController");

const customerRoutes = (db) => {
  // Funzione per ottenere tutti i prodotti dal database
  router.get("/GetAll", (req, res) => {
    getAll(req, res, db);
  });

  router.get("/GetCustomerById/:id", (req, res) => {
    getCustomerById(req, res, db);
  });

  router.get("/GetImagesByCustomerId/:id", (req, res) => {
    getImagesByCustomerId(req, res, db);
  });

  router.get("/GetCustomersNumber", (req, res) => {
    getCustomersNumber(res, db);
  });

  router.get("/GetAllShippingInfo", (req, res) => {
    getAllShipping(req, res, db);
  });

  router.get("/GetShippingInfoById/:id", (req, res) => {
    getShippingInfoById(req, res, db);
  });

  router.get("/GetCustomerByEmail", (req, res) => {
    getCustomerByEmail(req, res, db);
  });
  router.get("/CheckSession", async (req, res) => {
    CheckSession(req, res);
  });

  router.get("/GetCustomerData", async (req, res) => {
    GetCustomerData(req, res, db);
  });

  router.get("/CheckOTP/:email/:token", async (req, res) => {
    checkOTP(req, res, db);
  });

  router.get("/Logout", async (req, res) => {
    logout(req, res);
  });

  router.post("/Login", async (req, res) => {
    login(req, res, db);
  });

  router.post("/StartRecoverPass", async (req, res) => {
    SendOTP(req, res, db);
  });

  router.post("/Register", async (req, res) => {
    register(req, res, db);
  });

  router.post("/AddShippingInfo", async (req, res) => {
    addShippingInfo(req, res, db);
  });

  router.post("/LoadDocument", upload.any(), async (req, res) => {
    loadDocument(req, res, db);
  });

  router.put("/SetDefaultShipping", async (req, res) => {
    setDefaultShipping(req, res, db);
  });

  router.put("/UpdateCustomerData", async (req, res) => {
    updateCustomerData(req, res, db);
  });

  router.put("/UpdateCustomerPassword", async (req, res) => {
    updateCustomerPassword(req, res, db);
  });

  router.put("/UpdateCustomerPasswordByEmail", async (req, res) => {
    updateCustomerPasswordEmail(req, res, db);
  });

  router.put("/UpdateStatus/:id", async (req, res) => {
    updateCustomerStatus(req, res, db);
  });

  router.put("/UpdateShippingInfo", async (req, res) => {
    updateShippingDetail(req, res, db);
  });

  router.get("/isDefaultShipping", async (req, res) => {
    isDefault(req, res, db);
  });

  router.delete("/DeleteCustomer/:id", (req, res) => {
    console.log("Test");
    DeleteAccount(req, res, db);
  });

  router.delete("/DeleteShippingInfo", (req, res) => {
    deleteShippingInfo(req, res, db);
  });

  return router;
};

module.exports = customerRoutes;
