const cartService = require("../services/cart.service.js");

class CartController {

    async createCart(req, res) {
        try {
            const cartCreate = await cartService.createCart();
            res.send(cartCreate);
        } catch (error) {
            res.status(500).send("Error del servidor");
        }
    }

    async addProductToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        try {
            const cartUpdated = await cartService.addProductToCart(cartId, productId, quantity);
            res.send(cartUpdated.products);
        } catch (error) {
            res.status(500).send("Error al ingresar un producto al carrito");
        }
    }

    async deleteProductFromCart(req, res) {
        let idc = req.params.cid;
        let idp = req.params.pid;
        try {
            const cartUpdated = await cartService.deleteProductFromCart(idc, idp);
            res.status(200).send("se vacio el carrito correctamente");
        } catch (error) {
            res.status(404).send({ message: "error", error: "carrito no encontrado" });
        }
    }

    async deleteCartById(req, res) {
        let id = req.params.cid;
        const cartDeleted = await cartService.deleteCartById(id);
        if (!cartDeleted) {
            res.status(404).send({ message: "error", error: "carrito no encontrado" });
        } else {
            res.status(200).send(`se elimino ${cartDeleted.id} correctamente`);
        }
    }

    async getCartById(req, res) {
        const cartId = req.params.cid;
        try {
            const carritoBuscado = await cartService.getCartById(cartId);
            res.send(carritoBuscado.products);
        } catch (error) {
            res.status(500).send("Error no se encuentra carrito");
        }
    }

    async getCart(req, res) {
        try {
            const carts = await cartService.getCart();
            res.status(200).send(carts);
        } catch (error) {
            res.status(500).send({ status: "error", message: error.message });
        }
    }
}

module.exports = new CartController;
