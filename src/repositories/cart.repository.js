const cartDao = require("../dao/cart.dao.js");

class CartRepository{
    async createCart() {
        return await cartDao.create();
    }

    async addProductToCart(cartId, productId, quantity) {
        return await cartDao.addProductToCart(cartId, productId, quantity);
    }

    async deleteProductFromCart(cartId, productId) {
        return await cartDao.removeProductFromCart(cartId, productId);
    }

    async deleteCartById(cartId) {
        return await cartDao.deleteCart(cartId);
    }

    async getCartById(cartId){
        return await cartDao.findById(cartId)
    }

    async getCart(){
        return await cartDao.getCart()
    }

}

module.exports = new CartRepository();
