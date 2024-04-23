import ProductsManager from "../daos/mongoDb/DB/productsManager.js";
const productDao = new ProductsManager();


export const getAll = async (req, res) => {
    try {
        const { page, limit, sortOrder, year } = req.query;
        const products = await productDao.getAll(page, limit, sortOrder, year);
        res.json({ message: "List Products", products });
    } catch (error) {
        res.status(500).json({ message: "Error Server" });
    }
};

export const getById = async (req, res) => {
    try {
        const { id } = req.params
        const product = await productDao.getById(id);
        res.json({ message: "found Product:", product });
    } catch (error) {
        res.status(500).json({ message: "Error Server" });
    }
};

export const createProduct = async (req, res) => {
    try {
        const newProd = await productDao.createProduct(req.body);
        if (newProd) {
            res.status(200).json({ message: "Product created", newProd })
        } else {
            res.status(404).json({ msg: "Error create product!" })
        };
    } catch (error) {
        res.status(500).json({ message: "error server", error });
    };
};


export const productUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProductData = req.body; // Datos actualizados del producto

        // Llama a la función de tu DAO para actualizar el producto
        const updatedProduct = await productDao.updateProduct(id, updatedProductData);

        // Verifica si el producto se actualizó correctamente
        if (updatedProduct) {
            res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const prodDel = await productDao.productDelete(id)
        if (prodDel) res.status(200).json({ msg: `Product id: ${id} deleted` });
        else res.status(404).json({ msg: "Error delete product!" });
    } catch (error) {
        next(error.message);
    }
}

export const getAggregation = async (req, res) => {
    try {
        const { year } = req.params;
        const getProducts = await productDao.aggregationProduct(year);
        //verifica si hay algún producto en el array devuelto 
        if (getProducts.length > 0) {
            res.json({ message: "List Products", getProducts });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}




