import { Router } from "express";
import * as controller from "../../controllers/products.controllers.js"

const routerDB = Router();
// Ruta de prueba postman
// Muestra todos los productos default de limite 10 productos
// http://localhost:8080/api/products
// http://localhost:8080/api/products?limit=5

// filtrado por Asc y Desc
// http://localhost:8080/api/products?sortOrder=asc
// http://localhost:8080/api/products?sortOrder=desc
// http://localhost:8080/api/products?page=1&limit=5&year=2023&sortOrder=asc  se filtra por limit, año y por orden

// Filtrado por año
// http://localhost:8080/api/products?year=2024
// http://localhost:8080/api/products?limit=10&year=2024
// http://localhost:8080/api/products?page=2&limit=5&year=2024

routerDB.get("/", controller.getAll);
routerDB.get("/:id", controller.getById)
routerDB.get("/search/:year", controller.getAggregation);
routerDB.post("/add", controller.createProduct);
routerDB.put("/update/:id", controller.productUpdate);
routerDB.delete("/:id", controller.deleteProduct);


export default routerDB;