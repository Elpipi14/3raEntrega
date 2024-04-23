import fs from "fs";

export class CartsManager {
    constructor() {
        this.path = './src/data/carts.json';
    };

    //lee archivo json
    getAllFileCarts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            return JSON.parse(data) || [];
        } catch (err) {
            return [];
        };
    };

// Guarda el producto sobre el carrito creado
    async saveProductToCart(idCart, idProd, product) {
        try {
            // Obtiene todos los carritos
            let carts = await this.getCarts();

            // Verifica si se encontró un carrito con el id especificado.
            let cart = carts.find(cart => cart.id === idCart);
            if (!cart) {
                // Si no se encuentra el carrito, lanza un error
                throw new Error("Cart not found");
            };

            // Busca si ya existe un producto con el mismo idProd en el carrito actual
            const existingProduct = cart.products.find(p => p.product === idProd);
            
            if (existingProduct) {
                // Verifica si la cantidad agregada no excede el stock disponible
                if (existingProduct.quantity + 1 <= product.stock) {
                    existingProduct.quantity += 1; // Incrementa la cantidad del producto en 1
                } else {
                    // Si excede el stock disponible, lanza un error
                    console.log("Stock limit reached");
                    throw new Error("Stock limit reached");
                }
            } else {
                // Si el producto no existe en el carrito
                // Verifica si hay suficiente stock para agregar al menos una unidad
                if (product.stock >= 1) {
                    // Crea un nuevo objeto de producto con la cantidad 1 y lo agrega al carrito
                    const newProduct = {
                        product: idProd,
                        quantity: 1,
                        title: product.title,
                        price: product.price
                    };
                    cart.products.push(newProduct);
                } else {
                    // Si el producto está fuera de stock, lanza un error
                    throw new Error("Product out of stock");
                }
            }

            // Encuentra el índice del carrito actual en la lista de carritos
            const cartIndex = carts.findIndex(c => c.id === idCart);
            if (cartIndex !== -1) {
                // Reemplaza el carrito actualizado en la lista de carritos
                carts[cartIndex] = cart;
                // Escribe los carritos actualizados en el archivo JSON
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
            };
            // Devuelve el carrito actualizado
            return cart;
        } catch (error) {
            // Maneja cualquier error que ocurra durante el proceso e imprime un mensaje de error
            console.error("Error in saveProductToCart:", error);
        };
    };

    //Busca por Id
    async getCartById(cid) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === cid);
            return cart ? cart : (console.error(`Cart with ID ${cartId} not found.`), false);
        } catch (error) {
            console.error(error);
            throw new Error("Error finding cart");
        }
    }

    //Contabiliza el Id
    async getId() {
        let maxId = 0;
        const carts = await this.getCarts();
        carts.forEach(cart => {
            if (cart.id > maxId) maxId = cart.id;
        });
        return maxId;
    }

    //muestra todos los carritos
    getCarts() {
        return this.getAllFileCarts();
    };

    //crear el carrito con su id
    async createCarts() {
        try {
            let carts;
            // Intenta obtener todos los carritos existentes
            try {
                carts = await this.getCarts();
            } catch (error) {
                // Si no hay carritos o hay un error al obtenerlos, establece carts como un array vacío
                carts = [];
            }
            // Obtener un nuevo ID para el carrito sumando 1 al ID más alto actual
            const newCartId = (await this.getId()) + 1;
            // Crear un nuevo objeto carrito con el ID generado y una lista de productos vacía
            const newCart = { id: newCartId, products: [] };
            // Agregar el nuevo carrito a la lista de carritos
            carts.push(newCart);
            // Escribir los carritos actualizados en el archivo JSON
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
            // Devolver el nuevo carrito creado
            return newCart;
        } catch (error) {
            // Si hay algún error durante el proceso, imprimir un mensaje de error y lanzar una excepción
            console.error("Error creating cart:", error);
            throw new Error("Unable to create cart");
        };
    };


    // Elimina el carrito por su ID
    async deleteCart(cartId) {
        try {
            // Obtener todos los carritos
            const carts = await this.getCarts();
            
            // Verificar si el carrito que se desea eliminar existe
            const cartExists = carts.some(cart => cart.id === cartId);
            
            // Si el carrito no existe, imprimir un mensaje indicando que no se puede encontrar
            if (!cartExists) {
                console.log(`Cart with ID ${cartId} does not exist.`);
                // Retornar false para indicar que la eliminación no fue exitosa
                return false;
            }
            
            // Filtrar los carritos para eliminar el carrito con el ID dado
            const updatedCarts = carts.filter(cart => cart.id !== cartId);
            
            // Escribir los carritos actualizados en el archivo JSON
            await fs.promises.writeFile(this.path, JSON.stringify(updatedCarts, null, 2));
            
            // Imprimir un mensaje indicando que el carrito fue eliminado exitosamente
            console.log(`Cart with ID ${cartId} deleted successfully.`);
            
            // Retornar true para indicar que la eliminación fue exitosa
            return true;
        } catch (error) {
            // Manejar cualquier error que ocurra durante el proceso e imprimir un mensaje de error
            console.error(`Error deleting cart with ID ${cartId}: ${error}`);
            // Retornar false para indicar que la eliminación no fue exitosa
            return false;
        }
    };

   //elimina producto adentro de cart
    async deleteCartProduct(cartId, productId) {
        try {
            // Obtener todos los carritos
            const carts = await this.getCarts();
            // Encontrar el carrito con el ID dado
            let cart = carts.find(c => c.id == cartId);

            // Si no se encuentra el carrito, imprimir un mensaje y retornar falso
            if (!cart) {
                console.log(`Cart with ID ${cartId} not found.`);
                return false;
            }

            // Imprimir los productos del carrito
            console.log("Cart products:", cart.products);
            // Encontrar el índice del producto en el carrito basado en el ID del producto
            const productIndex = cart.products.findIndex(p => p.product == productId);

            // Si el producto no se encuentra en el carrito, imprimir un mensaje y retornar falso
            if (productIndex === -1) {
                console.log(`Product with product ${productId} not found in cart.`);
                return false;
            };

            // Eliminar el producto del carrito utilizando el índice encontrado
            cart.products.splice(productIndex, 1);

            // Escribir los cambios en el archivo JSON que contiene los datos de los carritos
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));

            // Retornar el carrito actualizado
            return cart;
        } catch (error) {
            console.error(`Error deleting product ${productId} from cart ${cartId}: ${error}`);
            return false;
        };
    };

};