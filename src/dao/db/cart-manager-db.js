const CartModel = require("../models/cart.model.js");

class CartManager {

    async createCart() {
        try {
            const nuevoCarrito = new CartModel({products:[]});
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            console.log("error al crear un carrito");
        }
    }

    async getCartById(carritoId) {
        try {
            const carritoBuscado = await CartModel.findById(carritoId).populate("products.product", "_id title price");
            if (!carritoBuscado) {
                throw new Error("No existe un carrito con ese id");
            }
            return carritoBuscado;
        } catch (error) {
            console.log("Error al obtener el carrito por id");
            throw error;
        }
    }

    async addProductToCart(carritoId, productoId, quantity = 1) {
        try {
            const carrito = await this.getCartById(carritoId);
        const existeProducto = carrito.products.find(p => p.product.toString() === productoId);
        if (existeProducto) {
            existeProducto.quantity += quantity;
        } else {
            carrito.products.push({ product: productoId, quantity });
        }
        carrito.markModified("products");     
        await carrito.save();
        return carrito;
        } catch (error) {
            console.log("error al agregar un producto al carrito")
        }
    }

    // ver ERROR al actualizar !!!!!!

    async updateQuantityProductToCart(cartId, productId, quantity) {
        try {
            const carrito = await CartModel.findById(cartId);
            if (!carrito) {
                console.log("No existe ese carrito con el id");
                return null;
            }
            const productToUpdate = carrito.products.find((item) => item.product._id.toString() == productId);    // ****
            if (!productToUpdate) {
                console.log("Producto no encontrado en el carrito");
                return null;
            }
            productToUpdate.quantity = quantity;
            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            console.log("Error al actualizar la cantidad del producto", error);
            throw error;
        }
    }


    async deleteProductFromCart(cartId, productId) {
        try {
            const carritoActualizado = await CartModel.findByIdAndUpdate(cartId, { $pull: { products: { product: productId } } }, { new: true });
            if (!carritoActualizado) {
                console.log("No existe ese carrito con el id o el producto no se encontró en el carrito");
                return null;
            }
            return carritoActualizado;
        } catch (error) {
            console.log("Error al eliminar producto del carrito", error);
            throw error;
        }
    }


    async deleteCartById(id) {
        try {
            const carritoBuscado = await CartModel.findByIdAndDelete(id);
            if (!carritoBuscado) {
                throw new Error("No existe un carrito con ese id");
            }
            return carritoBuscado;
        } catch (error) {
            console.log("Error al obtener el carrito por id");
            throw error;
        }
    }
}

module.exports = CartManager; 




