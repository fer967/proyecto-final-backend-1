const express = require("express");
const router = express.Router();
const CartManager = require("../dao/db/cart-manager-db.js");
const cartManager = new CartManager();
const CartModel = require("../dao/models/cart.model.js");
const ProductModel = require("../dao/models/product.model.js");
const TicketModel = require("../dao/models/tickets.model.js");
const UserModel = require("../dao/models/user.model.js");
const {calcularTotal} = require("../utils/util.js");

router.post("/", async (req, res) => {
    try {
        const carritoCreado = await cartManager.createCart();
        res.send(carritoCreado);
    } catch (error) {
        res.status(500).send("Error del servidor");
    }
})

router.get("/", async(req, res) => {
    try {
        const carts = await CartModel.find(); 
        res.status(200).send(carts);
    } catch (error) {
        res.status(500).send({status:"error", message:error.message});
    }
}
)

router.get("/:cid", async (req, res) => {
    const carritoID = req.params.cid;
    try {
        const carritoBuscado = await cartManager.getCartById(carritoID);
        res.send(carritoBuscado.products);
    } catch (error) {
        res.status(500).send("Error no se encuentra carrito");
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    const carritoId = req.params.cid;
    const productoId = req.params.pid;
    const quantity = req.body.quantity || 1;
    try {
        const carritoActualizado = await cartManager.addProductToCart(carritoId, productoId, quantity);
        res.send(carritoActualizado.products);
    } catch (error) {
        res.status(500).send("Error al ingresar un producto al carrito");
    }
})

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

router.delete("/:cid/product/:pid", async(req, res) => {
    let idc = req.params.cid;
    let idp = req.params.pid;
    try {
        const carritoActualizado = await cartManager.deleteProductFromCart(idc, idp);
    res.status(200).send("se vacio el carrito correctamente");
    } catch (error) {
        res.status(404).send({message:"error", error:"carrito no encontrado"});
    }
})

router.delete("/:cid", async(req, res) => {
    let id = req.params.cid;
    const carritoEliminado = await cartManager.deleteCartById(id);
    if(! carritoEliminado){
        res.status(404).send({message:"error", error:"carrito no encontrado"});
    } else{
        res.status(200).send(`se elimino ${carritoEliminado.id} correctamente`);
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