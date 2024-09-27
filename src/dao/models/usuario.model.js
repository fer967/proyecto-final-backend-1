const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
    nombre:String,
    apellido:String,
    edad:Number,
    email: String,
    password: String,
    rol: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
})

const UsuarioModel = mongoose.model("usuarios", usuarioSchema);

module.exports = UsuarioModel;
