const fs = require("fs").promises;

class ProductManager {
    static ultId = 0;
    constructor(path) {
        this.products = [];
        this.path = path;
        this.cargarArray(); 
    }

    async cargarArray() {
        try {
            this.products = await this.leerArchivo();
        } catch (error) {
            console.log("Error al inicializar ProductManager");
        }
    }

    async addProduct({ title, description, price, code, stock}) {
        if (!title || !description || !price || !code || !stock) {
            console.log("Todos los campos son obligatorios");
            return;
        }
        if (this.products.some(item => item.code === code)) {
            console.log("El codigo debe ser unico");
            return;
        }
        const lastProductId = this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
        const nuevoProducto = {
            id: lastProductId + 1,
            title,
            description,
            price,
            code,
            stock,
        };
        this.products.push(nuevoProducto); 
        await this.guardarArchivo(this.products);
    }

    async getProducts() {
        try {
            const arrayProductos = await this.leerArchivo(); 
            return arrayProductos;
        } catch (error) {
            console.log("Error al leer el archivo", error); 
        }
    }

    async getProductById(id) {
        try {
            const arrayProductos = await this.leerArchivo();
            const buscado = arrayProductos.find(item => item.id === id); 
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

    async updateProduct(id, {...data }){
        const response = await this.leerArchivo();
        const index = response.findIndex(prod => prod.id == id);
        if (index != -1) {
            response[index] = { id, ...data };
            await this.guardarArchivo(response);
            return response[index]
        } else {
            console.log("producto no encontrado");
        }
    }

    async deleteProduct(id) {
        const arrayProductos = await this.leerArchivo();
        const indexProd = arrayProductos.findIndex(item => item.id === id);
        const deletedProd = await this.getProductById(id);
        if (indexProd !== -1) {
            arrayProductos.splice(indexProd, 1);
            console.log(`se elimino ${deletedProd.title}`);
            await this.guardarArchivo(arrayProductos);
            return deletedProd;
        } else {
            return "Producto no encontrado";
        }
    }

    async leerArchivo() {
        const respuesta = await fs.readFile(this.path, "utf-8");
        const arrayProductos = JSON.parse(respuesta);
        return arrayProductos;
    }

    async guardarArchivo(arrayProductos) {
        await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    }
}

module.exports = ProductManager; 

