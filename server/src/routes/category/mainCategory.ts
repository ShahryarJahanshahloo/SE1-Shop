import express, { Router, Request, Response } from 'express'
import {
  TypedRequestBody,
  TypedRequestBodyWithParams,
} from '../../TypedRequestBody'
import auth from '../../middlewares/auth'
import { userRoles } from '../../models/user/user'
import MainCategory, { IMainCategory } from '../../models/category/mainCategory'
import { updateByValidKeys } from '../../utils/common'

const router: Router = express.Router()

router.post(
  '/',
  auth([userRoles.Admin]),
  async (req: TypedRequestBody<IMainCategory>, res: Response) => {
    try {
      const category = new MainCategory(req.body)
      await category.save()
      res.status(201).send(category)
    } catch (error) {
      res.status(400).send(error)
    }
  }
)

router.get('/', async (req: Request, res: Response) => {
  try {
    const mainCategories = await MainCategory.find()
    res.send(mainCategories)
  } catch (error) {}
})

router.patch(
  '/:id',
  auth([userRoles.Admin]),
  async (
    req: TypedRequestBodyWithParams<IMainCategory, { id: string }>,
    res: Response
  ) => {
    try {
      const category = await MainCategory.findById(req.params.id)
      if (category === null) return res.status(400).send()
      await updateByValidKeys(category, req.body, ['name'])
      res.send(category)
    } catch (error) {
      res.status(500).send(error)
    }
  }
)

export default router
