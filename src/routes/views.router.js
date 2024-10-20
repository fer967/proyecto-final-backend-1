const express = require("express");
const router = express.Router();
const productModel = require("../dao/models/product.model.js");
const passport = require("passport");
const {soloAdmin, soloUser} = require("../middleware/auth.js");

router.get("/products", passport.authenticate("jwt", { session: false }), soloUser, async (req, res) => {
        let page = req.query.page || 1;
        let limit = 2; 
    try {
        const listadoProductos = await productModel.paginate({}, {limit, page});   
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

module.exports = router; 