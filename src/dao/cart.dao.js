const CartModel = require("./models/cart.model.js");
const ProductModel = require("./models/product.model.js");

class CartDao{
    
    async create() {
        const newCart = new CartModel();
        return await newCart.save();
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
        const product = await ProductModel.findById(productId);
        if (!product) {
            throw new Error("Producto no encontrado");
        }
        const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
        return await cart.save();
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
        cart.products = cart.products.filter((p) => p.product._id.toString() !== productId.toString());
        return await cart.save();
    }

    async deleteCart(cartId) {
        return await CartModel.findByIdAndDelete(cartId);
    }

    async getCartById(cartId){
        return await CartModel.findById(cartId)
    }

    async getCart(){
        return await CartModel.find()
    }

}

module.exports = new CartDao();
