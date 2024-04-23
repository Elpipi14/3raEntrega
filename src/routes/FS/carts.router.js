import { Router } from "express";
import { CartsManager } from "../../daos/fileSystem/cartManager.js";
import { ProductManager } from "../../daos/fileSystem/productManager.js";

const routerCarts = Router();
const cartsManager = new CartsManager();
const productsManager = new ProductManager();

//Muestra carts creado localhost:8080/api/carts/ o localhost:8080/api/carts?limit=3
routerCarts.get("/", async (req, res) => {
    try {
        let limit = req.query.limit;
        let carts;
        if (limit) {
            carts = await cartsManager.getCarts().slice(0, limit);
            res.status(200).json({ status: "success", message: "List carts", carts: carts });
        } else {
            carts = cartsManager.getCarts();
            res.status(200).json({ status: "success", message: "List carts", carts: carts });
        };
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 500, message: "Error interno del servidor" });
    };
});

// Busca por Id
routerCarts.get("/:id", async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        const products = await cartsManager.getCartById(id);
        res.send(products);
    } catch (error) {
        res.status(404).json({ status: "error", message: error.message });
    }
});


//crear carrito localhost:8080/api/carts/
routerCarts.post('/', async (req, res) => {
    try {
        const newCart = await cartsManager.createCarts();
        res.status(201).json({ status: "success", message: "Cart created", cart: newCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating a cart', error: error.message });
    }
});

//agregar al cart creado el producto localhost:8080/api/carts/1/products/1
routerCarts.post('/:cid/products/:pid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);

        const product = await productsManager.getProductById(pid);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await cartsManager.getCartById(cid);

        if (!cart) {
            cart = await cartsManager.createCart({ id: cid, products: [] });
        }
        const updatedCart = await cartsManager.saveProductToCart(cid, pid, product);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(400).json({ message: 'Error processing request', error: error.message });
    };
});


//elimina el cart localhost:8080/api/carts/3
routerCarts.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const idNumber = parseInt(id);
        const cartDeleted = await cartsManager.deleteCart(idNumber);
        if (cartDeleted) {
            res.status(200).json({ message: `Cart with id: ${idNumber} deleted` });
        } else {
            res.status(404).json({ message: `Cart with id ${idNumber} not found` });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//elimina producto adentro del cart localhost:8080/api/carts/1/products/1
routerCarts.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);
        const cart = await cartsManager.deleteCartProduct(cid, pid);
        res.status(200).json(cart);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});


export default routerCarts;







