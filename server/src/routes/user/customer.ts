import express, { Router, Request, Response } from 'express'
import Customer from '../../models/user/customer'
import { TypedRequestBody } from '../../TypedRequestBody'

const router: Router = express.Router()

router.post(
  '/',
  async (
    req: TypedRequestBody<{
      name: string
      lastName: string
      email: string
      phoneNumber: number
      password: string
    }>,
    res: Response
  ) => {
    try {
      const customer = new Customer(req.body)
      await customer.save()
      await customer.generateAccessToken()
      res.status(201).send(customer)
    } catch (error) {
      console.log(error)
      res.status(400).send({ message: 'invalid request' })
    }
  }
)

export default router