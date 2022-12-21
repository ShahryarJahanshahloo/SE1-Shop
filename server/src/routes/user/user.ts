import express, { Router, Request, Response } from 'express'
import User from '../../models/user/user'
import { TypedRequestBody } from '../../TypedRequestBody'

const router: Router = express.Router()

router.post(
  '/login',
  async (
    req: TypedRequestBody<{ email: string; password: string }>,
    res: Response
  ) => {
    try {
      const user = await User.findByCredentials(
        req.body.email,
        req.body.password
      )
      if (!user) return res.status(404).send()
      const token = await user.generateAccessToken()
      res.send({ user, token })
    } catch (error) {
      console.log(error)
      res.status(500).send()
    }
  }
)

export default router
