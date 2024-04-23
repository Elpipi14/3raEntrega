import { UserModel } from "../schema/user.model.js";
import { createHash, isValidPassword } from "../../../utils/bcryptHash.js";

export default class UserManager {

    async findByEmail(email) {
        try {
            const response = await UserModel.findOne({ email });
            return response;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    
    async findById(_id) {
        try {
            const response = await UserModel.findOne({ _id });
            return response;
        } catch (error) {
            console.log(error);
            return null;
        }
    };


    async register(userData) {
        try {
            const existingUser = await UserModel.findOne({ email: userData.email });
            if (existingUser) {
                throw new Error("Email is already registered");
            }
            // Verifica si el correo electrónico es "adminCoder@coder.com"
            // y asigna el rol correspondiente
            if (userData.email === "adminCoder@coder.com") {
                userData.role = "admin";
            }

            const hashedPassword = createHash(userData.password); // Hash de la contraseña
            const newUser = await UserModel.create({ ...userData, password: hashedPassword }); // Combina userData con la contraseña hasheada
            return newUser;
        } catch (error) {
            throw error;
        }
    }

    async login(email, password) {
        try {
            const userExist = await UserModel.findOne({ email });
            if (userExist && isValidPassword(password, userExist.password)) {
                return userExist;
            } else {
                return null;
            }
        } catch (error) {
            console.log("Login failed:", error);
            throw new Error("Login failed");
        }
    }
}
