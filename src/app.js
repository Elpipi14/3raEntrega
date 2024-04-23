// crear servidor express
import express from "express";
//Handlebars
import exphbs from "express-handlebars";;
//session
import session from "express-session";
// mongoStore
import MongoStore from "connect-mongo";

//connect mongo
import "./daos/mongoDb/connection/mongooseConnection.js";
//Import router
// import routerProducts from "./routes/FS/products.router.js";
// import routerCarts from "./routes/FS/carts.router.js";
import routerViews from "./routes/views.js";
//DB router
import routerUser from "./routes/DB/usersDB.js";
import routerDB from "./routes/DB/productsDB.js";
import routerCartDB from "./routes/DB/cartsDB.js";
//Passport
import passport from "passport";
import initializePassport from "./config/passport.config.js";

//designamos el puerto
const PORT = 8080;

// creando una nueva instancia de la aplicación Express
const app = express();

//Este middleware cuando una solicitud llega al servidor con un cuerpo en formato JSON. 
app.use(express.json());

//este middleware lo analiza y lo convierte en un objeto JavaScript 
app.use(express.urlencoded({ extended: true }));

//config handlebars: express busca archivos .handelbars y lo renderize
//le decimos a express que use el motor de plantilla:
app.engine("handlebars", exphbs.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set("view engine", "handlebars");
app.set("views", "./src/views");
//carpeta static Public
app.use(express.static('./src/public'));

//instanciamos para aplicar en session
app.use(session({
    secret: "secretCoder",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://admin:admin14@clusterecommerce.bfjaefn.mongodb.net/store?retryWrites=true&w=majority",
        collection: 'sessions',
        ttl: 60
    }),
    cookie: {
        maxAge: 60000,
    }
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session())


//routes
// app.use("/api/products", routerProducts);
// app.use("/api/carts", routerCarts);
app.use("/api", routerUser);
app.use("/api/products", routerDB);
app.use("/api/cart", routerCartDB);
app.use("/", routerViews);

//indicar al servidor que comience a escuchar las solicitudes
const httpServer = app.listen(PORT, () => {
    console.log(`escuchando al puerto ${PORT}`);
});










