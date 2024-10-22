const { createHash, isValidPassword } = require("../utils/util.js");
const userRepository = require("../repositories/user.repository.js");
const CartManager = require("../dao/db/cart-manager-db.js");
const cartManager = new CartManager();

class UserService{
    async registerUser(userData){
        const existeUsuario = await userRepository.getUserByEmail(userData.email);
        if(existeUsuario) throw new Error("el usuario ya existe");
        userData.password = createHash(userData.password);
        const nuevoCarrito = await cartManager.createCart();                  
        userData.cart = nuevoCarrito._id;                                    
        return await userRepository.createUser(userData);
    }

    async loginUser(email, password){
        const user = await userRepository.getUserByEmail(email);
        if(!user || !isValidPassword(password, user)) throw new Error("credenciales invalidas");
        return user;
    }
}

module.exports = new UserService();

