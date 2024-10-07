import mongoose from "mongoose";
import collections from "../utils/collections.js";
const orderSchema = new mongoose.Schema(
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
        accessories: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        }],
        size: {type: String, required: true},
        quantity: {
          type: Number,
          required: true,
        },
        note: {
          type: String
        }
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipping", "Delivered", "Cancelled", "Deleted"],
      default: "Pending",
    },
    shippingAddress: { type: String },
    typePayment: {
      type: String,
      default: 'COD'
    },
    discount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "discounts",
      default: 0
    },
    deleted: {type: Boolean, default: false}
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model(collections.ORDERS, orderSchema);

const createOrderDB = (data) => OrderModel.create(data)
const getOrderDB = (info) => OrderModel.find(info)
const editOrderDB = (...args) => OrderModel.findOneAndUpdate(...args)

export {
  createOrderDB,
  getOrderDB,
  editOrderDB
}