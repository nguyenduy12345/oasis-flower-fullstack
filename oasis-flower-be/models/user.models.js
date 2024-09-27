import mongoose from "mongoose";

import collections from "../utils/collections.js";

const userSchema = new mongoose.Schema({
  username: {type: String, unique: true, required: true,},
  email: {type: String, required: true, unique: true,},
  password: { type: String, required: true},
  phonenumber: { type: String, required: true },
  address: { type: String, required: true },
  avatar: { type: String },
  banned: {type: Boolean, default: false},
  accesstoken: {type: String, expireAt: { type: Date, default: Date.now, expires: 180 }},
  refreshtoken: {type: String, expireAt: { type: Date, default: Date.now, expires: 2592000 }},
  role: [{
    type: String,
    default: "user",
    }],
},{
  timestamps: true,
  versionKey: false
});

const UserModel = mongoose.model(collections.USERS, userSchema);

const countUserDB = () => UserModel.countDocuments();
const getUserDB = () => UserModel.find();
const createUserDB = (data) => UserModel.create(data);
const findUserDB = (data) => UserModel.findOne(data);
const updateUserDB = (...args) => UserModel.findOneAndUpdate(...args)

export { createUserDB, findUserDB, getUserDB, countUserDB, updateUserDB };
