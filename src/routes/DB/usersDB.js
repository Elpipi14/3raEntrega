import { Router } from "express";
import * as controller from "../../controllers/users.controllers.js";
import passport from "passport"; // Importa Passport

const routerUser = Router();

// Ruta de registro utilizando Passport middleware
routerUser.post('/register', passport.authenticate('register'));

// Ruta de inicio de sesión utilizando Passport middleware
routerUser.post("/login", passport.authenticate('login'), controller.login);

// Ruta para cerrar sesión
routerUser.get("/logout", controller.logOut);

export default routerUser;
