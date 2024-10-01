import mongoose from "mongoose";
import collections from "../utils/collections.js";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products", 
          required: true,
        },
        quantity: {
          type: Number,
          default: 0,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const CartModel = mongoose.model(collections.CARTS, cartSchema);

const getCartDB = (userId) => CartModel.findOne(userId);
const updateCartDB = (...args) => CartModel.findOneAndUpdate(...args);
const deleteCartDB = (...args) => CartModel.findOneAndDelete(...args);

export default CartModel
export { getCartDB, updateCartDB, deleteCartDB };
