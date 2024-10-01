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
        size:{
          type: String,
          default: 's',
        },
        note:{
          type: String,
          default: ''
        },
        accessories:[{
          type: mongoose.Schema.Types.ObjectId,
          ref: "products"
        }]
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

export default CartModel
export { getCartDB };
