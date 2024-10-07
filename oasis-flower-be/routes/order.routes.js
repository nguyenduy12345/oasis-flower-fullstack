import { Router } from 'express'
import { getOrder, getAllOrder, createOrder, handleEditOrderByUser, handleDeleteOrderByUser, handleEditOrderByAdmin, handleDeleteOrderByAdmin} from '../controllers/order.controllers.js'
import authMiddleware from '../middlewares/auth.middlewares.js'

const orderRoute = Router()
orderRoute.get('/orders', getOrder)
orderRoute.post('/orders', createOrder)
orderRoute.patch('/orders/:orderId', handleEditOrderByUser)
orderRoute.patch('/orders/delete/:orderId', handleDeleteOrderByUser)

orderRoute.get('/orders-all', authMiddleware.auhthorizationAdmin, getAllOrder)
orderRoute.patch('/orders/admin/:orderId', authMiddleware.auhthorizationAdmin, handleEditOrderByAdmin)
orderRoute.patch('/orders/admin/delete/:orderId', authMiddleware.auhthorizationAdmin, handleDeleteOrderByAdmin)

export default orderRoute