const cartRepository = require("../repositories/cart.repository.js");

class CartService{
    async createCart() {
        return await cartRepository.createCart();
    }

    async addProductToCart(cartId, productId, quantity) {
        return await cartRepository.addProductToCart(cartId, productId, quantity);
    }

    async deleteProductFromCart(cartId, productId) {
        return await cartRepository.deleteProductFromCart(cartId, productId);
    }

    async deleteCartById(cartId) {
        return await cartRepository.deleteCartById(cartId);
    }

    async getCartById(cartId){
        return await cartRepository.getCartById(cartId)
    }

    async getCart(){
        return await cartRepository.getCart()
    }

}

module.exports = new CartService();