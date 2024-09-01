const express = require("express");
const router = express.Router();
const CartManager = require("../dao/db/cart-manager-db.js");
const cartManager = new CartManager();
const cartModel = require("../dao/models/cart.model.js");

router.post("/", async (req, res) => {
    try {
        const carritoCreado = await cartManager.crearCarrito();
        res.send(carritoCreado);
    } catch (error) {
        res.status(500).send("Error del servidor");
    }
})


router.get("/", async(req, res) => {
    try {
        const carts = await cartModel.find(); 
        res.status(200).send(carts);
    } catch (error) {
        res.status(500).send({status:"error", message:error.message});
    }
}
)

router.get("/:cid", async (req, res) => {
    const carritoID = req.params.cid;
    try {
        const carritoBuscado = await cartManager.getCarritoById(carritoID);
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
        const carritoActualizado = await cartManager.agregarProductoAlCarrito(carritoId, productoId, quantity);
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
        const carritoActualizado = await cartManager.actualizarProductoDelCarrito(carritoId, productoId, quantity);
        res.send(carritoActualizado.products);
    } catch (error) {
        res.status(500).send("Error al actualizar un producto al carrito");
    }
})

router.delete("/:cid/product/:pid", async(req, res) => {
    let idc = req.params.cid;
    let idp = req.params.pid;
    try {
        const carritoActualizado = await cartManager.eliminarProductoDelCarrito(idc, idp);
    res.status(200).send("se vacio el carrito correctamente");
    } catch (error) {
        res.status(404).send({message:"error", error:"carrito no encontrado"});
    }
})

router.delete("/:cid", async(req, res) => {
    let id = req.params.cid;
    const carritoEliminado = await cartManager.deleteCarritoById(id);
    if(! carritoEliminado){
        res.status(404).send({message:"error", error:"carrito no encontrado"});
    } else{
        res.status(200).send(`se elimino ${carritoEliminado.id} correctamente`);
    }
})

module.exports = router; 