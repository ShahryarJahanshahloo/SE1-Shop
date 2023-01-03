import express, { Router, Request, Response } from 'express'
import Seller, { ISeller } from '../../models/user/seller'
import {
  TypedRequestBody,
  TypedRequestBodyWithParams,
} from '../../TypedRequestBody'
import { userRoles } from '../../models/user/user'
import auth from '../../middlewares/auth'

const router: Router = express.Router()

router.post('/', async (req: TypedRequestBody<ISeller>, res: Response) => {
  try {
    const seller = new Seller(req.body)
    await seller.save()
    await seller.generateAccessToken()
    res.status(201).send(seller)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.put(
  '/:id/rate',
  auth([userRoles.Customer]),
  async (
    req: TypedRequestBodyWithParams<
      {
        value: number
      },
      { id: string }
    >,
    res: Response
  ) => {
    try {
      const seller = await Seller.findById(req.params.id)
      if (seller === null) return res.status(400).send()
      for (const rating of seller.ratings) {
        if (rating.customer == req.user.id) {
          rating.value = req.body.value
          await seller.save()
          return res.send()
        }
      }
      seller.ratings.push({
        customer: req.user.id,
        value: req.body.value,
      })
      await seller.save()
      res.send()
    } catch (error) {
      res.status(400).send(error)
    }
  }
)

router.delete(
  '/:id/rate',
  auth([userRoles.Customer]),
  async (req: Request, res: Response) => {
    try {
      const seller = await Seller.findById(req.params.id)
      if (seller === null) return res.status(400).send()
      seller.ratings.filter(rating => {
        return rating.customer != req.user.id
      })
      await seller.save()
      res.send()
    } catch (error) {
      res.status(400).send(error)
    }
  }
)

export default router
