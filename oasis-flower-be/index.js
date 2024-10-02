import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
dotenv.config()

import userRoute from './routes/user.routes.js'
import productRoute from './routes/product.routes.js'
import cartRoute from './routes/cart.routes.js'

import authMiddleware from './middlewares/auth.middlewares.js'

import { handleForgotPassword, login, refreshtoken, register } from './controllers/user.controllers.js'
import { getProduct } from './controllers/product.controllers.js'

const MONGODB_SRV = process.env.MONGO_DB
await mongoose.connect(MONGODB_SRV)
console.log('database is connected')

const PORT = process.env.PORT_LOCAL || 8080

let corsOptions = {
    origin: process.env.HOST,
}

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

app.post('/api/v1/register', register)
app.post('/api/v1/login', login )
app.post('/api/v1/refresh-token', refreshtoken)
app.post('/api/v1/forgot-password', handleForgotPassword)
app.get('/api/v1/products/:product', getProduct)
app.get('/api/v1/products', getProduct)

app.use(authMiddleware.authentication)

app.use('/api/v1', userRoute)
app.use('/api/v1', productRoute)
app.use('/api/v1', cartRoute)

app.listen(PORT, (err) => {
    if(err) throw new Error("Can't running server")
    console.log('Server is running ' + PORT)
})
