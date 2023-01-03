import express, { Router, Request, Response } from 'express'
import Admin, { IAdmin } from '../../models/user/admin'
import { TypedRequestBody } from '../../TypedRequestBody'
import auth from '../../middlewares/auth'
import { userRoles } from '../../models/user/user'

const router: Router = express.Router()

router.post(
  '/',
  auth([userRoles.Admin]),
  async (req: TypedRequestBody<IAdmin>, res: Response) => {
    try {
      const admin = new Admin(req.body)
      await admin.save()
      await admin.generateAccessToken()
      res.status(201).send(admin)
    } catch (error) {
      console.log(error)
      res.status(400).send({ message: 'invalid request' })
    }
  }
)

export default router
