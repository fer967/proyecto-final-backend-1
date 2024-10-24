const productModel = require("../models/product.model.js");

class ProductManager {

    async addProduct({ title, description, price, code, stock}) {
        try {
            if (!title || !description || !price || !code || !stock) {
                console.log("Todos los campos son obligatorios");
                return;
            }
            const existeCodigo = await productModel.findOne({code: code});
            if(existeCodigo){
                console.log("el codigo ya existe");
                return;
            }
            const nuevoProducto = new productModel({
                title,
                description,
                price,
                code,
                stock                
            });
            await nuevoProducto.save();
        } catch (error) {
            console.log("error al agregar un producto");
        }
    }

    async getProducts() {
        try {
            const arrayProductos = await productModel.find(); 
            return arrayProductos;
        } catch (error) {
            console.log("Error al leer el archivo", error); 
        }
    }

    async getProductById(id) {
        try {
            const buscado = await productModel.findById(id); 
            if (!buscado) {
                console.log("producto no encontrado"); 
                return null; 
            } else {
                console.log("Producto encontrado"); 
                return buscado; 
            }
        } catch (error) {
            console.log("Error al buscar por id", error); 
        }
    }

    async updateProduct(id, productoActualizado){
        try {
            const actualizado = await productModel.findByIdAndUpdate(id, productoActualizado);
            if(!actualizado){
                console.log("no se encuentra producto");
                return null;
            }
            return actualizado;
        } catch (error) {
            console.log("se produjo un error");
        }
    }

    async deleteProduct(id) {
        try {
            const eliminado = await productModel.findByIdAndDelete(id);
            if(!eliminado){
                console.log("no se encuentra producto");
                return null;
            }
            return eliminado;
        } catch (error) {
            console.log("se produjo un error");
        }
    }
}

module.exports = ProductManager; 
