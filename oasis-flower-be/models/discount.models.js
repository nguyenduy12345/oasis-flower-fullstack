import mongoose from "mongoose";
import collections from "../utils/collections.js";

const discountSchema = new mongoose.Schema({
  code: {type: String, required: true, unique: true},
  discount: {type: Number,required: true, default: 0},
  active: {type: Boolean, default: true},
  startDate: {type: String},
  endDate: {type: String}  
},{
    timestamps: true
})

const DiscountModel = mongoose.model(collections.DISCOUNTS, discountSchema)

const createDiscountDB = (info) => DiscountModel.create(info)
const getAllDiscountDB = (info) => DiscountModel.find(info)
const getDiscountDB = (info) => DiscountModel.findOne(info)
const editDiscountDB = (...args) => DiscountModel.findOneAndUpdate(...args)
const deleteDiscountDB = (...args) => DiscountModel.findOneAndDelete(...args)
export {
    createDiscountDB,
    getAllDiscountDB,
    getDiscountDB,
    editDiscountDB,
    deleteDiscountDB
}
