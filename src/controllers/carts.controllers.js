import CartsManager from "../daos/mongoDb/DB/carts.Manager.js";
const cartDao = new CartsManager();

export const createCart = async (req, res, next) => {
    try {
        const cart = await cartDao.createCart();
        res.status(200).json({ message: "Create to Cart", cart });
    } catch (error) {
        next(error.message);
    }
};

export const addToCart = async (req, res, next) => {
    try {
        const { cId, pId } = req.params;
        const cart = await cartDao.addToCart(cId, pId);
        res.status(200).json({ message: "Add product to cart", cart });
    } catch (error) {
        if (error.message === "Product not found" || error.message === "Cart not found") {
            res.status(404).json({ msg: error.message });
        } else {
            next(error.message);
        }
    }
};

export const getAll = async (req, res, next) => {
    try {
        const cart = await cartDao.getAll();
        res.status(200).json({ message: "List Carts", cart });
    } catch (error) {
        next(error.message);
    }
};

export const getById = async (req, res, next) => {
    try {
        const { cId } = req.params;
        const cart = await cartDao.getById(cId);
        res.status(200).json({ message: "found cart", cart });
    } catch (error) {
        next(error.message);
    }
};

//borra el producto del cart
export const deleteProduct = async (req, res, next) => {
    try {
        const { cId, pId } = req.params;
        const cart = await cartDao.deleteProduct(cId, pId);
        res.status(200).json({ message: "Product delete to cart", cart });
    } catch (error) {
        console.log(error);
        next(error.message);
    }
};

export const deleteCart = async (req, res, next) => {
    try {
        const { cId } = req.params;
        await cartDao.deleteCart(cId);
        res.status(200).json({ msg: "Cart deleted" });
    } catch (error) {
        next(error.message);
    }
};
