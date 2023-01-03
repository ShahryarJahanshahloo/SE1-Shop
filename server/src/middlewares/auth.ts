import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

import User, { userRoles } from '../models/user/user'

interface JWTPayload {
  _id: string
}

const auth = (roles?: userRoles[] | undefined) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1]
      if (token == null) return res.sendStatus(401)
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload

      console.log(decoded + '\n \n')
      const user = await User.findOne(
        { _id: decoded._id, 'tokens.token': token },
        '_id role'
      )
      if (!user) throw new Error()

      if (roles) {
        if (roles.includes(user.role) == false) throw new Error('invalid role')
      }
      req.user = user
      next()
    } catch (e) {
      res.status(401).send({ error: e })
    }
  }
}

export default auth
