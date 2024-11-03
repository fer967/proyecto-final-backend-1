const express = require("express");
const router = express.Router();
const ProductModel = require("../dao/models/product.model.js");
const passport = require("passport");
const {soloAdmin, soloUser} = require("../middleware/auth.js");
const CartManager = require("../dao/db/cart-manager-db.js");
const cartManager = new CartManager();

router.get("/", (req, res) => {
    res.render("admin")
}) 

router.get("/carts", (req, res) => {
    res.render("carts")
}) 

router.get("/tickets", (req, res) => {
    res.render("tickets")
}) 


router.get("/products", passport.authenticate("jwt", { session: false }), soloUser, async (req, res) => {
        let page = req.query.page || 1;
        let limit = 2; 
    try {
        const listadoProductos = await ProductModel.paginate({}, {limit, page});   
        const productosResultadoFinal = listadoProductos.docs.map( prod => {
            const{_id, ...rest} = prod.toObject();
            return rest; 
        })
        res.render("products", {
            products: productosResultadoFinal, 
            hasPrevPage: listadoProductos.hasPrevPage,
            hasNextPage: listadoProductos.hasNextPage,
            prevPage: listadoProductos.prevPage, 
            nextPage: listadoProductos.nextPage,
            currentPage: listadoProductos.page, 
            totalPages: listadoProductos.totalPages
        })
    } catch (error) {
        console.log(error);
        res.status(500).send("error");
    }
})

router.get("/register", (req, res) => {
    res.render("register");
})

router.get("/login", (req, res) => {
    res.render("login");
})

router.get("/realtimeproducts", passport.authenticate("jwt", { session: false }), soloAdmin, (req, res) => {
    res.render("realtimeproducts");
})

router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await cartManager.getCartById(cartId);
        if (!cart) {
            console.log("No existe ese carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        const productsInCart = cart.products.map(item => ({
            product: item.product.toObject(),
            quantity: item.quantity
        }));
        res.render("carts", { products: productsInCart });
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


module.exports = router; 