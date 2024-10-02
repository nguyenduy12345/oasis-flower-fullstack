import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import randomstring from "randomstring";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

import {
  countUserDB,
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
    res.cookie("refresh_token", "test");
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
      { expiresIn: "12h" }
    );
    const refreshtoken = jwt.sign(
      { username, email, role, _id },
      process.env.REFRESH_TOKEN_KEY,
      { expiresIn: "30d" }
    );
    (user.accesstoken = accesstoken), (user.refreshtoken = refreshtoken);
    await user.save();
    // res.cookie("refresh_token", refreshtoken, {
    //   maxAge: +process.env.COOKIE_MAX_AGE_REFRESH_TOKEN,
    //   httpOnly: true
    // })
    // res.cookie('access_token', accesstoken, {
    //   maxAge: +process.env.COOKIE_MAX_AGE_ACCESS_TOKEN,
    //   httpOnly: true
    // })
    // res.cookie("access_token", accesstoken, { expires: new Date(Date.now() + +process.env.COOKIE_MAX_AGE_ACCESS_TOKEN), httpOnly: true })
    // res.cookie("refresh_token", refreshtoken, { expires: new Date(Date.now() + +process.env.COOKIE_MAX_AGE_REFRESH_TOKEN), httpOnly: true })
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
      { expiresIn: "12h" }
    );
    const refToken = jwt.sign(
      { username, email, role, _id },
      process.env.REFRESH_TOKEN_KEY,
      { expiresIn: "30d" }
    );
    await updateUserDB(
      {
        _id,
      },
      {
        accesstoken,
        refreshtoken: refToken,
      }
    );
    res.status(201).send({
      accesstoken,
      refreshtoken: refToken,
    });
  } catch (error) {
    res.status(401).send({
      message: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  const { pageNumber, pageSize } = req.query;
  try {
    if (pageNumber && pageSize) {
      const totalUsers = await countUserDB();
      const totalPages = Math.ceil(totalUsers / pageSize);
      const skip = (pageNumber - 1) * pageSize;
      const users = await getUserDB({role:'user'}).skip(skip).limit(pageSize);
      res.status(200).send({
        users,
        totalPages,
        pageNumber,
      });
      return
    }
    const users = await getUserDB()
    res.status(200).send({
        users
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
    const { email, avatar, phonenumber, address, role } = user;
    res.status(200).send({
      user: {
        username,
        email,
        avatar,
        phonenumber,
        address,
        role
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
    const newPassword = randomstring.generate(7);
    const salt = bcrypt.genSaltSync(+process.env.SALT_ROUNDS);
    const hash = bcrypt.hashSync(newPassword, salt);
    const user = await updateUserDB(
      {
        email,
      },
      {
        password: hash,
      }
    );
    if (!user) throw new Error("user not exist");
    await sendEmail(email, newPassword);
    res.status(201).send({
      message: "Email sent success",
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
    });
  }
};

const handleChangeAvatar = async (req, res) => {
  const { _id } = req.data;
  const file = req.file;
  try {
    let urlImage;
    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;
    const fileName = file.originalname.split(".")[0];
    await cloudinary.uploader.upload(
      dataUrl,
      {
        public_id: fileName,
        resource_type: "auto",
      },
      (err, result) => {
        if (err) throw new Error("upload file failed");
        if (result) {
          urlImage = result.secure_url;
          return urlImage;
        }
      }
    );
    await updateUserDB(
      {
        _id,
      },
      {
        avatar: urlImage,
      }
    );
    res.status(201).send({
      message: "Change avatar success",
      avatar: urlImage,
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
    });
  }
};
const handleBanAccount = async (req, res) => {
  const { userId } = req.query
  try {
    const crrUser = await updateUserDB({
      _id: userId
    },{
      banned: true
    })
    if(!crrUser) throw new Error("can't find user")
    res.status(201).send({
      message: "Banned success"
    })
  } catch (error) {
    res.status(403).send({
      message: error.message,
    });
  }
};
const handleReBanAccount = async (req, res) => {
  const { userId } = req.query
  try {
    const crrUser = await updateUserDB({
      _id: userId
    },{
      banned: false
    })
    if(!crrUser) throw new Error("can't find user")
    res.status(201).send({
      message: "Re-ban success"
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
  handleChangeAvatar,
  handleBanAccount,
  handleReBanAccount
};
