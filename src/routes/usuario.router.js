const express = require("express");
const router = express.Router();
const UsuarioModel = require("../dao/models/usuario.model.js");
const jwt = require("jsonwebtoken");
const {createHash, isValidPassword} = require("../utils/util.js");
const passport = require("passport");

router.post("/register", async(req, res) => {
    const{nombre, apellido, edad, email, password} = req.body;
    try {
        const existeUsuario = await UsuarioModel.findOne({ email});
        if(existeUsuario){
            return res.status(400).send("el usuario ya existe en la DB");
        }
        const nuevoUsuario = new UsuarioModel({
            nombre,
            apellido,
            edad,
            email,
            password: createHash(password)
        });
        await nuevoUsuario.save();
        const token = jwt.sign({email: nuevoUsuario.email}, "coder", {expiresIn: "1h"});     
        res.cookie("coderCookieToken", token, {                                                  
            maxAge:3600000,
            httpOnly: true
        })
        res.redirect("/api/sessions/current");
    } catch (error) {
        res.status(500).send("error interno del servidor");
    }
})

router.post("/login", async(req, res) => {
    const{email, password} = req.body;
    try {
        const usuarioEncontrado = await UsuarioModel.findOne({ email});
        if(!usuarioEncontrado){
            return res.status(401).send("usuario no encontrado");
        }
        if(!isValidPassword(password, usuarioEncontrado)){
            return res.status(401).send("contraseña incorrecta");
        }
        const token = jwt.sign({email: usuarioEncontrado.email, rol: usuarioEncontrado.rol}, "coder", {expiresIn:"1h"});
        res.cookie("coderCookieToken", token, {                                                  
            maxAge:360000,
            httpOnly: true
        });
        res.redirect("/api/sessions/current");
    } catch (error) {
        res.status(500).send("error interno del servidor");
    }
})

router.post("/logout", (req, res) => {
    res.clearCookie("coderCookieToken");
    res.redirect("/login");
})

router.get("/current", passport.authenticate("current", {session:false}), (req, res) => {       
    res.render("index", {usuario: req.user.usuario});                                            
})

router.get("/admin", passport.authenticate("current", {session:false}), (req, res) => {
    if(req.user.rol !== "admin") {
        return res.status(403).send("Acceso denegado!"); 
    }
    res.render("admin"); 
})

module.exports = router;