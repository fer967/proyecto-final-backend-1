const express = require("express");
const router = express.Router();
const productModel = require("../dao/models/product.model.js");

router.get("/products", async (req, res) => {
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

module.exports = router; 