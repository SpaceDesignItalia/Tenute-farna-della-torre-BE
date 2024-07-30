const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const https = require("https");
const fs = require("fs");

const createProductRoutes = require("./Routes/Products");
const createFeaturedRoutes = require("./Routes/Featured");
const createDiscountRoutes = require("./Routes/Discount");
const createStafferRoutes = require("./Routes/Staffer");
const createCustomerRoutes = require("./Routes/Customer");
const createAnalyticRoutes = require("./Routes/Analytic");
const createPaymentRoutes = require("./Routes/Payments");

const app = express();
app.use(express.static("public"));
const PORT = 3000;

const db = require("./configs/Database");
require("dotenv").config();

app.use(
  cors({
    origin: [
      "https://www.tenutefarina.it",
      "https://tenutefarina.it",
      "https://tenutefarina.com",
      "https://admin.tenutefarina.com",
      "http://localhost:5174",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(
  session({
    secret: "T^pX#z1$0%V@l2&nHbO8yGcLsAaE!WuPq4Rv7*3Sd9MwYjNfCmKgJiBkD5F",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 172800000,
      secure: false,
      httpOnly: false,
      //sameSite: "none",
    },
  })
);

app.use(cookieParser());

const productRoutes = createProductRoutes(db);
app.use("/Products", productRoutes);

const featuredRoutes = createFeaturedRoutes(db);
app.use("/Featured", featuredRoutes);

const discountRoutes = createDiscountRoutes(db);
app.use("/Discounts", discountRoutes);

const stafferRoutes = createStafferRoutes(db);
app.use("/Staffer", stafferRoutes);

const customerRoutes = createCustomerRoutes(db);
app.use("/Customer", customerRoutes);

const analyticRoutes = createAnalyticRoutes(db);
app.use("/Analytic", analyticRoutes);

const paymentRoutes = createPaymentRoutes(db);
app.use("/Payment", paymentRoutes);

// Configura l'opzione per HTTPS
const options = {
  key: fs.readFileSync("SSL/privatekey.key"),
  cert: fs.readFileSync("SSL/Ecommerce.pem"),
};

// Crea un server HTTPS
const server = https.createServer(options, app);
// Avvia il server su HTTPS
app.listen(PORT, () => {
  console.log(
    `Server Express in ascolto sulla porta ${PORT} in modalità HTTPS`
  );
});
