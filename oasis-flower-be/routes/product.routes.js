import { Router } from "express";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import authMiddleware from "../middlewares/auth.middlewares.js";
import { createProduct, getAllProduct, handleUpdateProduct, handleDeleteProduct } from "../controllers/product.controllers.js";

const productRoute = Router()
productRoute.get('/admin/products', authMiddleware.auhthorizationAdmin, getAllProduct)
productRoute.post('/products', authMiddleware.auhthorizationAdmin, upload.single("file"), createProduct)
productRoute.patch('/products', authMiddleware.auhthorizationAdmin, handleDeleteProduct)
productRoute.patch('/products/:productId', authMiddleware.auhthorizationAdmin, upload.single("file"), handleUpdateProduct)

export default productRoute
