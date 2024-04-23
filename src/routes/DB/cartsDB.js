import { Router } from "express";
import * as controller from "../../controllers/carts.controllers.js"

const routerCartDB = Router();

routerCartDB.get("/", controller.getAll);
routerCartDB.get("/:cId", controller.getById);

routerCartDB.post("/add", controller.createCart);
routerCartDB.post("/:cId/add/:pId", controller.addToCart);

routerCartDB.delete("/:cId/product/:pId", controller.deleteProduct);
routerCartDB.delete("/:cId", controller.deleteCart);

export default routerCartDB;