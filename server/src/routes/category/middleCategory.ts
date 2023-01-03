import express, { Router, Request, Response } from 'express'
import {
  TypedRequestBody,
  TypedRequestBodyWithParams,
} from '../../TypedRequestBody'
import auth from '../../middlewares/auth'
import { userRoles } from '../../models/user/user'
import MiddleCategory, {
  IMiddleCategory,
} from '../../models/category/middleCategory'
import { updateByValidKeys } from '../../utils/common'

const router: Router = express.Router()

router.post(
  '/',
  auth([userRoles.Admin]),
  async (req: TypedRequestBody<IMiddleCategory>, res: Response) => {
    try {
      const category = new MiddleCategory(req.body)
      await category.save()
      res.status(201).send(category)
    } catch (error) {
      res.status(400).send(error)
    }
  }
)

router.patch(
  '/:id',
  auth([userRoles.Admin]),
  async (
    req: TypedRequestBodyWithParams<IMiddleCategory, { id: string }>,
    res: Response
  ) => {
    try {
      const category = await MiddleCategory.findById(req.params.id)
      if (category === null) return res.status(400).send()
      await updateByValidKeys(category, req.body, ['name', 'parent'])
      res.send(category)
    } catch (error) {
      res.status(500).send(error)
    }
  }
)

export default router
