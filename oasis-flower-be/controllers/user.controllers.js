import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import randomstring from "randomstring"
import { google } from "googleapis";

import {
  createUserDB,
  findUserDB,
  getUserDB,
  updateUserDB,
} from "../models/user.models.js";

import sendEmail from "../services/mail.js";

const register = async (req, res) => {
  const { username, email, phonenumber, password, address, role } = req.body;
  try {
    if (!username || !email || !phonenumber || !password || !address)
      throw new Error("Enter your information");
    const checkUserName = await findUserDB({ username });
    if (checkUserName) throw new Error("Username is existed");
    const checkUserEmail = await findUserDB({ email });
    if (checkUserEmail) throw new Error("Email is existed");
    const salt = bcrypt.genSaltSync(+process.env.SALT_ROUNDS);
    const hash = bcrypt.hashSync(password, salt);
    const isRole = role ? role : "user";
    const newUser = await createUserDB({
      username,
      email,
      phonenumber,
      password: hash,
      address,
      role: isRole,
    });
    res.status(201).send({
      data: newUser,
      message: "Created success",
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
    });
  }
};
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await findUserDB({ username });
    if (!user) throw new Error("username or password is wrong");
    if (user.banned) throw new Error("account is banned");
    const checkPassword = bcrypt.compareSync(
      password.toString(),
      user.password
    );
    if (!checkPassword) throw new Error("username or password is wrong");
    const { email, role, _id } = user;
    const accesstoken = jwt.sign(
      { username, email, role, _id },
      process.env.ACCESS_TOKEN_KEY,
      { expiresIn: "3d" }
    );
    const refreshtoken = jwt.sign(
      { username, email, role, _id },
      process.env.REFRESH_TOKEN_KEY,
      { expiresIn: "30d" }
    );
    (user.accesstoken = accesstoken), (user.refreshtoken = refreshtoken);
    await user.save();
    res.status(201).send({
      message: "login success",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
    });
  }
};

const refreshtoken = async (req, res) => {
  const { refreshtoken } = req.body;
  try {
    if (!refreshtoken) throw new Error("Token is expired");
    const { username, email, role, _id } = jwt.verify(
      refreshtoken,
      process.env.REFRESH_TOKEN_KEY
    );
    const accesstoken = jwt.sign(
      { username, email, role, _id },
      process.env.ACCESS_TOKEN_KEY,
      { expiresIn: "3m" }
    );
    res.status(201).send({
      accesstoken,
      refreshtoken,
    });
  } catch (error) {
    res.status(401).send({
      message: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await getUserDB();
    res.status(200).send({
      users,
    });
  } catch (error) {
    res.status(401).send({
      message: error.message,
    });
  }
};
const getUser = async (req, res) => {
  const { username } = req.data;
  try {
    const user = await findUserDB({ username });
    const { email, avatar, phonenumber } = user;
    res.status(200).send({
      user: {
        username,
        email,
        avatar,
        phonenumber,
      },
    });
  } catch (error) {
    res.status(401).send({
      message: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  const { _id } = req.data;
  const { password, newPassword } = req.body;
  try {
    const user = await findUserDB({ _id });
    const checkPassword = bcrypt.compareSync(
      password.toString(),
      user.password
    );
    if (!checkPassword) throw new Error("password is wrong");
    const salt = bcrypt.genSaltSync(+process.env.SALT_ROUNDS);
    const hash = bcrypt.hashSync(newPassword.toString(), salt);
    user.password = hash;
    await user.save();
    res.status(201).send({
      message: "Changed password success",
    });
  } catch (error) {
    res.status(401).send({
      message: error.message,
    });
  }
};
const handleForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) throw new Error("Enter your email");
    const newPassword = randomstring.generate(7)
    const salt = bcrypt.genSaltSync(+process.env.SALT_ROUNDS);
    const hash = bcrypt.hashSync(newPassword, salt);
    const user = await updateUserDB({
        email
    }, {
        password: hash
    })
    if(!user) throw new Error("user not exist")
    await sendEmail(email, newPassword)
    res.status(201).send({
        message: "Email sent success",
    })
  } catch (error) {
    res.status(403).send({
      message: error.message,
    });
  }
};
export {
  register,
  login,
  refreshtoken,
  getUsers,
  getUser,
  changePassword,
  handleForgotPassword,
};
