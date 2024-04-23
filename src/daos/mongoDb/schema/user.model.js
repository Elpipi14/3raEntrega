import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  },
  role: {
    type: String,
    default: "user",
  },
  cartId: {  // Agrega este campo para almacenar el ID del carrito
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",  // Asegúrate de que refleje el nombre correcto del modelo de carrito
  },
});

export const UserModel = mongoose.model("users", userSchema);