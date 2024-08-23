const express = require("express"); 
const productRouter = require("./routes/products.router.js");
const cartRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const exphbs = require("express-handlebars");
const app = express(); 
const PUERTO = 8080;
require("./database.js");

app.use(express.json()); 
app.use(express.urlencoded({extended: true}));
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);
app.use("/", express.static("./src/public"));

const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`); 
})

