// Passport con estrategia de autenticación y autorización.
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import GitHubStrategy from "passport-github2";

import UserManager from "../daos/mongoDb/DB/userManager.js"
const userManager = new UserManager();

import CartsManager from "../daos/mongoDb/DB/carts.Manager.js";
const cartManager = new CartsManager()

const initializePassport = () => {

    // Estrategia de registro de Usuario
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email",
    }, async (req, email, password, done) => {
        const { first_name, last_name, age, gender } = req.body;
        try {
            const user = await userManager.findByEmail(email);
            if (user) {
                return done(null, false, { message: "User already exists" });
            }
    
            // Crear un carrito para el nuevo usuario
            const cart = await cartManager.createCart({ products: [] });
    
            // Crear un nuevo usuario con el ID del carrito
            const result = await userManager.register({
                first_name,
                last_name,
                age,
                gender,
                email,
                password,
                cartId: cart._id, // Asignar el ID del carrito al usuario
            });
    
            return done(null, result, { message: "Successfully registered user" });
        } catch (error) {
            return done(error); // Pasar el error real
        }
    }));
    
    passport.use("login", new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        try {
            //Primero verifico si existe un usuario con ese email: 
            const user = await userManager.login(email, password);
            console.log(`busca el usuario: `, user);
            // Verificar si el usuario está autenticado correctamente
            if (!user) {
                return res.status(400).send("Credenciales inválidas");
            } 
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    // Serializar User:
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userManager.findById({ _id: id });
        done(null, user)
    });

    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.b1b1bb9978f789db",
        clientSecret: "258791470c6646f0eaa07554df5770541a57ac68",
        callbackURL: "http://localhost:8080/github",
        scope: ['user', 'users:email']
    }, async  (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
        const user = await UserModel.findOne({ email });
        if (user) return done(null, user);
        const newUser = await UserModel.create({
            first_name: profile._json.name,
            email,
            password: " ",
            image: profile._json.avatar_url,
            isGithub: true,
        });
        return done(null, newUser);
    }));

};

export default initializePassport;

