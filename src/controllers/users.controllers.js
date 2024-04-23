import UserManager from "../daos/mongoDb/DB/userManager.js";
const userService = new UserManager()

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const isRegistered = await userService.register({ ...req.body, password, email });

        if (isRegistered) {
            console.log("Successfully registered user. Redirecting to Login");
            res.status(200).json({ message: "Successfully registered user. Redirecting to Login" });
        } else {
            console.log("Error Register");
            res.status(500).json({ error: "Error Register" });
        }
    } catch (error) {
        if (error.message === "Email is already registered") {
            res.status(400).json({ error: "Email is already registered" });
        } else {
            console.error("Error registration:", error);
            next(error);
        }
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.login(email, password);

        if (user) {
            if (!req.session.email) {
                req.session = req.session || {};
                req.session.email = email;
                req.session.firstName = user.first_name;
                // Almacena toda la información del usuario en la sesión
                req.session.user = user;
            }
            console.log("User logged in correctly. Redirect a profile");
            res.status(200).json({ message: "User logged in correctly. Redirect a profile" })
        } else {
            console.log("Invalid credentials. Redirecting to /register-error");
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Error login:", error);
        res.status(500).json({ error: "Error login" });
    }
};

export const logOut = async (req, res) => {
    // Destruye la sesión del usuario
    req.session.destroy(err => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            res.status(500).send('Error interno del servidor');
        } else {
            console.log("Close Session");
            // Redirige al usuario a la página de inicio de sesión u otra página deseada
            res.status(200).json({ message: "Successfully logOut" });
        }
    });
};
