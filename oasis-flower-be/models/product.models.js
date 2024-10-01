import mongoose from "mongoose";
import collections from "../utils/collections.js";

const productSchema = new mongoose.Schema({
    product: {type: String, required: true},
    name: {type: String, required: true},
    desEN: {type: String, required: true},
    desVI: {type: String, required: true},
    image: {type: String, required: true},
    type: {type: String},
    priceEN: {type: String, required: true},
    priceVI: {type: String, required: true},
    deleted: {type: Boolean, default: false}
}
,{
    timestamps: true,
    versionKey: false
  })
const ProductModel = mongoose.model(collections.PRODUCTS, productSchema)

const countProductDB = () => ProductModel.countDocuments()
const getProductDB = (info) => ProductModel.find(info)
const createProductDB = (data) => ProductModel.create(data)
const updateProductDB = (...args) => ProductModel.findOneAndUpdate(...args)
export {
    getProductDB,
    createProductDB,
    countProductDB,
    updateProductDB
}