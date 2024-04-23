import { Schema, model } from "mongoose";
import schemaMiddleware from "../../../middleware/schema.js";

export const cartsCollection = "carts";

const cartSchema = new Schema({
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'products'
        },
        quantity: Number
    }],
});

// Aplicar el middleware Populate
cartSchema.pre("find", schemaMiddleware);

export const CartModel = model(cartsCollection, cartSchema);
