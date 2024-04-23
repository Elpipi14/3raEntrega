import { Router } from "express";
const routerProducts = Router();

// Importación de la clase ProductManager
import { ProductManager } from "../../daos/fileSystem/productManager.js";
const productsManager = new ProductManager();

// Busca todos los productos y busca por cantidad /products?limit=
routerProducts.get("/", async (req, res) => {
    try {
        let limit = req.query.limit;
        //trae los productos
        const products = await productsManager.getProducts();
        //Filtra por disponible
        let productsView = products.filter((product) => product.status === true);
        if (limit) {
            productsView = productsView.slice(0, limit); // Si hay límite, aplicamos el límite a los productos filtrados
        }
        res.send(productsView); // Enviamos la respuesta después de haber filtrado los productos
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 500, message: "Internal Server Error" });
    }
});

// Busca por Id
routerProducts.get("/:id", async (req, res) => {
    try {
        let id = req.params.id;
        const product = await productsManager.getProductById(id);

        if (!product) {
            return res.status(404).json({ status: "error", message: "Product not found" });
        }

        if (!product.status) {
            return res.status(404).json({ status: "error", message: "Product is not active" });
        }

        res.send(product);
    } catch (error) {
        res.status(500).json({ status: "error", message: "Product not found" });
    }
});

// Crea un producto
routerProducts.post("/", async (req, res) => {
    try {
        // Obtener los datos del producto del cuerpo de la solicitud
        const productData = req.body;

        // Agregar el producto
        const newProduct = await productsManager.addProduct(productData);

        // Verificar si el producto se agregó correctamente
        if (newProduct) {
            res.status(201).json({ status: "success", message: "Product created", product: newProduct });
        }
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// Modifica el producto buscado por id
routerProducts.put('/:id', async (req, res) => {
    try {
        const product = { ...req.body };
        const { id } = req.params;
        const idNumber = Number(id);
        const productOk = await productsManager.getProductById(idNumber);
        // Verifica la modificación del producto
        if (!productOk) {
            res.status(404).json({ message: 'Product not found' });
        } else {
            await productsManager.updateProduct(idNumber, product);
            res.status(200).json({ message: `Product id: ${id} updated` });
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
});

// Elimina el producto por id
routerProducts.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const idNumber = Number(id);
        const productToDelete = await productsManager.getProductById(idNumber);
        // Verificar si el producto se eliminó
        if (productToDelete) {
            await productsManager.deleteProduct(idNumber);
            res.json({ message: `Product id: ${idNumber} deleted` });
        } else {
            res.status(404).json({ message: `Product with id ${idNumber} not found` });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default routerProducts;
