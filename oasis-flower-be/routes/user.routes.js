import { Router } from "express";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import { getUsers, getUser, changePassword, handleChangeAvatar, handleBanAccount, handleReBanAccount } from "../controllers/user.controllers.js";
import authMiddleware from "../middlewares/auth.middlewares.js";

const userRoute = Router()

userRoute.get('/users', authMiddleware.auhthorizationAdmin, getUsers)
userRoute.patch('/ban-account', authMiddleware.auhthorizationAdmin, handleBanAccount)
userRoute.patch('/re-ban-account', authMiddleware.auhthorizationAdmin, handleReBanAccount)
userRoute.get('/profile', getUser)
userRoute.patch('/change-password', changePassword)
userRoute.patch('/change-avatar', upload.single("file"), handleChangeAvatar)

export default userRoute