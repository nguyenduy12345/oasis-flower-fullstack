import { Router } from "express";
import {handleGetCart, handleAddCart, handleUpdateCart, handleDeleteCart} from "../controllers/cart.controllers.js";
const cartRoute = Router()

cartRoute.get('/carts', handleGetCart)
cartRoute.post('/carts', handleAddCart)
cartRoute.patch('/carts', handleUpdateCart)
cartRoute.delete('/carts', handleDeleteCart)

export default cartRoute