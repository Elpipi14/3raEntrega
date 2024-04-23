import { CartModel } from "../schema/carts.model.js";
import { ProductsModel } from "../schema/products.model.js";

export default class CartsManager {

    async createCart() {
        try {
            const newCart = new CartModel({
                // Inicializa el carrito sin productos
                products: [],
            });
            // Guarda el nuevo carrito en la base de datos
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error(error);
            console.error("Error create cart", error);
            throw error;
        }
    }

    async addToCart(cartId, productId) {
        try {
            // Busca el producto 
            const product = await ProductsModel.findById(productId);
            if (!product) {
                throw new Error(`Product not found for ID: ${productId}`);
            };

            // Busca el carrito 
            let cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error(`Cart not found for ID: ${cartId}`);
            };

            // Si el carrito no tiene productos, se crea como un array vacío
            if (!cart.products) {
                cart.products = [];
            };

            // Busca si el producto ya existe en el carrito
            const existingProduct = cart.products.findIndex(item => item.product.equals(productId));

            // Si el producto ya está en el carrito, incrementa la cantidad
            if (existingProduct !== -1) {
                cart.products[existingProduct].quantity += 1;
            } else {
                // Si el producto no está en el carrito, lo añade al array 'products' del carrito
                cart.products.push({
                    product: productId,
                    quantity: 1
                });
            };
            // Guarda el carrito actualizado en la base de datos
            cart = await cart.save();
            return cart; // Devuelve el carrito actualizado
        } catch (error) {
            console.error(error);
            console.error("Error add product to cart", error);
            throw error;
        }
    };

    async getAll() {
        try {
            const carts = await CartModel.find()
            return carts;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getById(id) {
        try {
            //obtener un carrito por su ID con sus productos
            const cart = await CartModel.findById(id);
            return cart;
        } catch (error) {
            console.error("error searching ID", error);
        };
    };

    async deleteProduct(cartId, productId) {
        try {
            // Busca el carrito en la base de datos
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error(`Cart not found for ID: ${cartId}`);
            }

            // Filtra y elimina el producto del array de productos del carrito
            cart.products = cart.products.filter(item => item._id.toString() !== productId);

            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            console.error("error delete product to cart", error);
            throw error; // Maneja y relanza cualquier error que ocurra
        }
    };

    async deleteCart(cartId) {
        try {
            // Elimina el carrito por su ID
            const deletedCart = await CartModel.findByIdAndDelete(cartId);
            return deletedCart;
        } catch (error) {
            console.error("error delete cart", error);
            throw error;
        }
    };
};
