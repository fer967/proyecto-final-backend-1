const express = require("express");
const ProductManager = require("../dao/db/product-manager-db.js");
const manager = new ProductManager();
const router = express.Router();

router.get("/", async (req, res) => {
    const categoria = req.query.category;
    try {
        const arrayProductos = await manager.getProducts();
        if(categoria){
            res.send(arrayProductos.filter(prod => prod.category === categoria));
        }
        else {
            res.send(arrayProductos);
        }
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
})

router.get("/:pid", async (req, res) => {
    let id = req.params.pid;
    try {
        const producto = await manager.getProductById(id);
        if (!producto) {
            res.send("Producto no encontrado");
        } else {
            res.send(producto);
        }
    } catch (error) {
        res.send("Error al buscar ese id en los productos");
    }
})

router.post("/", async (req, res) => {
    const nuevoProducto = req.body;
    try {
        await manager.addProduct(nuevoProducto); 
        res.status(201).send("Producto agregado exitosamente"); 
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }
})

router.put("/:pid", async(req, res) => {
    const {pid} = req.params;
    const productoActualizado = req.body;
    try{
        await manager.updateProduct(pid, productoActualizado);
        res.json({message:"producto actualizado correctamente"});
    } catch(error){
    res.send(`error al actualizar el producto con id ${pid}`)
    }
    })

router.delete("/:pid", async(req, res) => {
    let id = req.params.pid;
    try {
        const deletedProd = await manager.deleteProduct(id);
        if(! deletedProd){
            res.status(404).send({message:"error", error:"producto no encontrado"});
        } else{
            res.status(200).send(`se elimino ${deletedProd.title} correctamente`);
        }
    } catch (error) {
        res.status(500).json({status: "error", message: error.message})
    }
})

module.exports = router; 
