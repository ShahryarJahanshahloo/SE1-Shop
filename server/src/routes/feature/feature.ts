import express, { Router, Request, Response } from 'express'
import {
  TypedRequestBody,
  TypedRequestBodyWithParams,
} from '../../TypedRequestBody'
import auth from '../../middlewares/auth'
import { userRoles } from '../../models/user/user'
import Feature, { IFeature } from '../../models/feature/feature'
import { updateByValidKeys } from '../../utils/common'

const router: Router = express.Router()

router.post(
  '/',
  auth([userRoles.Admin]),
  async (req: TypedRequestBody<IFeature>, res: Response) => {
    try {
      const feature = new Feature(req.body)
      await feature.save()
      res.status(201).send()
    } catch (error) {
      res.status(400).send(error)
    }
  }
)

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const feature = await Feature.findById(req.params.id)
    if (feature === null) return res.status(400).send()
    res.send(feature)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.patch(
  '/:id',
  auth([userRoles.Admin]),
  async (
    req: TypedRequestBodyWithParams<IFeature, { id: string }>,
    res: Response
  ) => {
    try {
      const feature = await Feature.findById(req.params.id)
      if (feature === null) return res.status(400).send()
      await updateByValidKeys(feature, req.body, ['label'])
      res.send(feature)
    } catch (error) {
      res.status(500).send(error)
    }
  }
)

export default router
