import {Router} from 'express'

import authMiddleware from '../middlewares/auth.middlewares.js'
import { getAllDiscount, createDiscount, getDiscount, handleActiveDiscountCode, handleStopActiveDiscountCode, handleDeleteDiscountCode } from '../controllers/discount.controllers.js'
const discountRoute = Router()

discountRoute.get('/discount-code', getDiscount)

discountRoute.get('/discount-code-all', authMiddleware.auhthorizationAdmin, getAllDiscount)
discountRoute.post('/discount-code',authMiddleware.auhthorizationAdmin, createDiscount)
discountRoute.patch('/discount-code-active/:code',authMiddleware.auhthorizationAdmin, handleActiveDiscountCode)
discountRoute.patch('/discount-code/:code',authMiddleware.auhthorizationAdmin, handleStopActiveDiscountCode)
discountRoute.delete('/discount-code/:code',authMiddleware.auhthorizationAdmin, handleDeleteDiscountCode)

export default discountRoute