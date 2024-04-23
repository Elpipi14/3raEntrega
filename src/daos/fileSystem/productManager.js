import fs from "fs";

export class ProductManager {
    constructor() {
        this.path = './src/data/products.json';
        this.id = 1;
    };

    async addProduct(product) {
        try {
            // Validar que todos los campos sean obligatorios
            if (!product.title || !product.description || !product.price || !product.imageUrl || !product.category || !product.code || !product.stock) {
                console.log("All fields are required");
                throw new Error("All fields are required");
            }

            // Leer productos existentes
            let products = await this.getAllFileProducts();

            // Validar que no se repita el campo "code" o "mismo id"
            if (products.some(existingProduct => existingProduct.code === product.code || existingProduct.id == product.id)) {
                console.log("A product with the same code or id already exists");
                return { error: true, message: "A product with the same code already exists" }; // No arrojar una excepción, solo devolver un mensaje al cliente
            }

            // Encontrar el máximo ID actual
            let maxId = products.length > 0 ? Math.max(...products.map(product => product.id)) : 0;

            // Agregar el producto con id autoincrementable y status por defecto
            const newProduct = {
                id: maxId + 1,
                status: true,
                ...product
            };
            products.push(newProduct);

            // Guardar en archivo
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

            console.log("Product added successfully:", newProduct);

            // Devolver el producto agregado
            return newProduct;
        } catch (error) {
            console.error("Error adding product:", error);
            throw error;
        }
    };

    // Lee el archivo json de forma asíncrona
    async getAllFileProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf8');
            return JSON.parse(data) || [];
        } catch (error) {
            console.error("Error reading file:", error);
            return [];
        }
    };

    // Muestra todos los productos de forma asíncrona
    async getProducts() {
        return await this.getAllFileProducts();
    };

    // Busca un producto por su ID de forma asíncrona
    async getProductById(id) {
        try {
            const products = await this.getAllFileProducts();
            const product = products.find(product => product.id === parseFloat(id));
            if (product) {
                return product;
            } else {
                console.error("Product not found");
                throw new Error("Product not found");
            }
        } catch (error) {
            console.error("Error getting product by ID", error);
            throw error;
        }
    };

    // Actualiza un producto por su ID de forma asíncrona
    async updateProduct(id, updatedProduct) {
        try {
            let products = await this.getAllFileProducts();
            const index = products.findIndex(product => product.id === id);
            // Validar que no se repita el campo "code" o "id"
            if (products.some(existingProduct => existingProduct.code === updatedProduct.code || existingProduct.id === updatedProduct.id)) {
                console.log("A product with the same code or id already exists");
                throw new Error("A product with the same code or id already exists");
            };
            if (index !== -1) {
                products[index] = { ...products[index], ...updatedProduct };
                await fs.promises.writeFile(this.path, JSON.stringify(products));
                console.log("Successfully updated product:", products[index]);
            } else {
                console.error("Product not found");
            }
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    };

    // Elimina un producto por su ID de forma asíncrona
    async deleteProduct(id) {
        try {
            let products = await this.getAllFileProducts();
            const filteredProducts = products.filter(product => product.id !== id);
            if (filteredProducts.length < products.length) {
                await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts));
                console.log("Product removed");
            } else {
                console.error("Product not found");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
        }
    };
};
