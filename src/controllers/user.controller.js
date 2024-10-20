const userService = require("../services/user.service.js");
const jwt = require("jsonwebtoken");
const UserDto = require("../dto/user.dto.js");
// adaptacion dotenv
const configObject = require("../config/config.js");
const {secret, tokenSecret} = configObject;

class UserController {
    async register(req, res) {
        const {first_name, last_name, email, age, password} = req.body; 
        try {
            const newUser = await userService.registerUser({first_name, last_name, email, age, password}); 
            const token = jwt.sign({
                usuario: `${newUser.first_name} ${newUser.last_name}`,
                email: newUser.email,
                role: newUser.role
            }, secret, {expiresIn: "1h"});
            
            res.cookie(tokenSecret, token, {maxAge: 3600000, httpOnly: true});
            res.redirect("/api/sessions/current");
        } catch (error) {
            res.status(500).send("Error del server");
        }
    }

    async login(req, res) {
        const {email, password} = req.body; 
        try {
            const user = await userService.loginUser(email, password);
            const token = jwt.sign({
                usuario: `${user.first_name} ${user.last_name}`,
                email: user.email,
                role: user.role
            }, secret, {expiresIn: "1h"});
            res.cookie(tokenSecret, token, {maxAge: 3600000, httpOnly: true});
            res.redirect("/api/sessions/current");
        } catch (error) {
            res.status(500).send("Error del server");
        }
    }

    async current(req, res) {
        if(req.user) {
            const user = req.user; 
            const userDto = new UserDto(user); 
            res.render("index", {user: userDto})         
        } else {
            res.send("No autorizado");
        }
    }

    async logout(req, res) {
        res.clearCookie(tokenSecret);
        res.redirect("/login");
    }

    async admin(req, res){
        if(req.user.role !== "admin") {
            return res.status(403).send("Acceso denegado!"); 
        }
        res.render("admin"); 
    } 
}

module.exports = UserController;

