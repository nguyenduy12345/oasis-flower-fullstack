import jwt from 'jsonwebtoken'
import { findUserDB } from '../models/user.models.js';

const authMiddleware = {
    authentication: async (req, res, next) => {
      const getToken = req.headers['authorization']
      try {
        if(!getToken) throw new Error("Unauthorized")
        const token = getToken.split(' ')[1]
        const verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN_KEY)
        const { _id } = verifyToken
        const user = await findUserDB({ _id })
        if(!user) throw new Error('Unauthorized')
        if(user.banned) throw new Error('Account is banned')
        req.data = verifyToken
        next();
      } catch (error) {
        res.status(401).send({
            message: error.message
        })
      }
    },
    auhthorizationAdmin: async (req, res, next) => {
      const { role } = req.data
      try{
        if(!role.includes("admin")) throw new Error('Unauthorized')
        next()
      } catch (error) {
        res.status(401).send({
          message: error.message
      })
    }
  }
};
export default authMiddleware;