const express = require("express");
const router = express.Router();
const CartManager = require("../dao/db/cart-manager-db.js");
const cartManager = new CartManager();
const CartModel = require("../dao/models/cart.model.js");
const ProductModel = require("../dao/models/product.model.js");
const TicketModel = require("../dao/models/tickets.model.js");
const UserModel = require("../dao/models/user.model.js");
const {calcularTotal} = require("../utils/util.js");
const cartController = require("../controllers/cart.controller.js");

router.get("/", cartController.getCart);
router.post("/", cartController.createCart);
router.post("/:cid/product/:pid", cartController.addProductToCart);
router.delete("/:cid/product/:pid", cartController.deleteProductFromCart);
router.delete("/:cid", cartController.deleteCartById);
router.get("/:cid", cartController.getCartById);

router.put("/:cid/product/:pid", async (req, res) => {
    const carritoId = req.params.cid;
    const productoId = req.params.pid;
    const quantity = req.body.quantity || 1;
    try {
        const carritoActualizado = await cartManager.updateQuantityProductToCart(carritoId, productoId, quantity);
        res.send(carritoActualizado.products);
    } catch (error) {
        res.status(500).send("Error al actualizar un producto al carrito");
    }
})

router.get("/:cid/purchase", async (req, res) => {
    const carritoId = req.params.cid;
    try {
        const carrito = await CartModel.findById(carritoId);                             
        const arrayProductos = carrito.products;
        const productosNoDisponibles = [];
        const productosComprados = [];
        for (const item of arrayProductos) {
            const productId = item.product;
            const product = await ProductModel.findById(productId);
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();
                productosComprados.push(item);
            } else {
                productosNoDisponibles.push(item);
            }
        }
        const usuarioDelCarrito = await UserModel.findOne({ cart: carritoId });          
        const ticket = new TicketModel({                                                 
            purchase_datetime: new Date(),
            amount: calcularTotal(productosComprados),                                  
            purchaser: usuarioDelCarrito.email,
        });
        await ticket.save();
        carrito.products = productosNoDisponibles;
        await carrito.save();
        res.json({
            message: "Compra generada",
            ticket: {
                id: ticket._id,
                amount: ticket.amount,
                purchaser: ticket.purchaser,
            },
            productosNoDisponibles: productosNoDisponibles.map((item) => item.product),
        });
    } catch (error) {
        res.status(500).send("Error del servidor al crear ticket");
    }
});

module.exports = router; 