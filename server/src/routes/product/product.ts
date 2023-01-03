import express, { Router, Request, Response } from 'express'
import {
  TypedRequestBody,
  TypedRequestBodyWithParams,
} from '../../TypedRequestBody'
import Product, { IProduct } from '../../models/product/product'
import auth from '../../middlewares/auth'
import { userRoles } from '../../models/user/user'
import { updateByValidKeys } from '../../utils/common'

const router: Router = express.Router()

router.post(
  '/',
  auth([userRoles.Seller, userRoles.Admin]),
  async (req: TypedRequestBody<IProduct>, res: Response) => {
    try {
      const product = new Product(req.body)
      await product.save()
      res.status(201).send(product)
    } catch (error) {
      res.status(400).send(error)
    }
  }
)

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
    if (product === null) return res.status(400).send()
    res.send(product)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.patch(
  '/:id',
  auth([userRoles.Admin]),
  async (
    req: TypedRequestBodyWithParams<IProduct, { id: string }>,
    res: Response
  ) => {
    try {
      const product = await Product.findById(req.params.id)
      if (product === null) return res.status(400).send()
      await updateByValidKeys(product, req.body, ['name', 'description'])
      res.send(product)
    } catch (error) {
      res.status(500).send(error)
    }
  }
)

router.patch(
  '/:id/approve',
  auth([userRoles.Admin]),
  async (req: Request, res: Response) => {
    try {
      const product = await Product.findById(req.params.id)
      if (product === null) return res.status(400).send()
      product.isApproved = true
      await product.save()
      res.send(product)
    } catch (error) {
      res.status(500).send(error)
    }
  }
)

router.patch(
  '/:id/disapprove',
  auth([userRoles.Admin]),
  async (req: Request, res: Response) => {
    try {
      const product = await Product.findById(req.params.id)
      if (product === null) return res.status(400).send()
      product.isApproved = false
      await product.save()
      res.send(product)
    } catch (error) {
      res.status(500).send(error)
    }
  }
)

router.patch(
  '/:id/activate',
  auth([userRoles.Admin]),
  async (req: Request, res: Response) => {
    try {
      const product = await Product.findById(req.params.id)
      if (product === null) return res.status(400).send()
      product.isActive = true
      await product.save()
      res.send(product)
    } catch (error) {
      res.status(500).send(error)
    }
  }
)

router.patch(
  '/:id/deactivate',
  auth([userRoles.Admin]),
  async (req: Request, res: Response) => {
    try {
      const product = await Product.findById(req.params.id)
      if (product === null) return res.status(400).send()
      product.isActive = false
      await product.save()
      res.send(product)
    } catch (error) {
      res.status(500).send(error)
    }
  }
)

router.get('/category/:id', async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ category: req.params.id })
    res.send(products)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get('/search', async (req: Request, res: Response) => {})

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
      const product = await Product.findById(req.params.id)
      if (product === null) return res.status(400).send()
      for (const rating of product.ratings) {
        if (rating.customer == req.user.id) {
          rating.value = req.body.value
          await product.save()
          return res.send()
        }
      }
      product.ratings.push({
        customer: req.user.id,
        value: req.body.value,
      })
      await product.save()
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
      const product = await Product.findById(req.params.id)
      if (product === null) return res.status(400).send()
      product.ratings.filter(rating => {
        return rating.customer != req.user.id
      })
      await product.save()
      res.send()
    } catch (error) {
      res.status(400).send(error)
    }
  }
)

export default router
