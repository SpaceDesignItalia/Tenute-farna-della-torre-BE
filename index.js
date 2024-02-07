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
const createStaffer = require("./Routes/Staffer");

const app = express();
app.use(express.static("public"));
const PORT = 3000;

const db = require("./configs/Database");

app.use(
  cors({
    origin: "http://localhost:5173",
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
      maxAge: 1080000,
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

const stafferRoutes = createStaffer(db);
app.use("/Staffer", stafferRoutes);

// Configura l'opzione per HTTPS
/* const options = {
  key: fs.readFileSync("SSL/privatekey.key"),
  cert: fs.readFileSync("SSL/certificato.pem"),
}; */

// Crea un server HTTPS
/* const server = https.createServer(options, app); */

// Avvia il server su HTTPS
app.listen(PORT, () => {
  console.log(
    `Server Express in ascolto sulla porta ${PORT} in modalità HTTPS`
  );
});
