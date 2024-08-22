const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://gabriel70080:coder@cluster0.yt1in.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0 ")
.then(() => console.log("conectado a la db"))
.catch(() => console.log("error en la conexion"))