import { Router } from "express";
import { getUsers, getUser, changePassword } from "../controllers/user.controllers.js";
import authMiddleware from "../middlewares/auth.middlewares.js";
const userRoute = Router()

userRoute.get('/users',authMiddleware.auhthorizationAdmin, getUsers)
userRoute.get('/profile', getUser)
userRoute.patch('/change-password', changePassword)

export default userRoute