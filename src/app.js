const express = require("express"); 
const productRouter = require("./routes/products.router.js");
const cartRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const app = express();

// *** adaptacion dotenv ***
const mongoose = require("mongoose");
const configObject = require("./config/config.js");
const {mongo_url, port} = configObject;

app.use(express.json()); 
app.use(express.urlencoded({extended: true}));
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", userRouter);
app.use("/", express.static("./src/public"));

// *** adaptacion dotenv ***
mongoose.connect(mongo_url)
    .then(() => console.log("conexion a la db"))
    .catch((error) => console.log("error", error))

app.listen(port, () => console.log(`servidor en http://localhost:${port}`)); 







