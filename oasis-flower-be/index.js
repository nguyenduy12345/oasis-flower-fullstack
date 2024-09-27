import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

import userRoute from './routes/user.routes.js'
import authMiddleware from './middlewares/auth.middlewares.js'
import { handleForgotPassword, login, refreshtoken, register } from './controllers/user.controllers.js'

const MONGODB_SRV = process.env.MONGO_DB
await mongoose.connect(MONGODB_SRV)
console.log('database is connected')

const PORT = process.env.PORT_LOCAL || 8080

const app = express()
app.use(express.json())
app.use(cors())

app.post('/api/v1/register', register)
app.post('/api/v1/login', login )
app.post('/api/v1/refresh-token', refreshtoken)
app.post('/api/v1/forgot-password', handleForgotPassword)

app.use(authMiddleware.authentication)

app.use('/api/v1', userRoute)

app.listen(PORT, (err) => {
    if(err) throw new Error("Can't running server")
    console.log('Server is running ' + PORT)
})
