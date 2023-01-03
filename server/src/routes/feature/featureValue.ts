import express, { Router, Request, Response } from 'express'
import FeatureValue, { IFeatureValue } from '../../models/feature/featureValue'
import auth from '../../middlewares/auth'
import { userRoles } from '../../models/user/user'
import {
  TypedRequestBody,
  TypedRequestBodyWithParams,
} from '../../TypedRequestBody'
import { updateByValidKeys } from '../../utils/common'

const router: Router = express.Router()

router.post(
  '/',
  auth([userRoles.Admin]),
  async (req: TypedRequestBody<IFeatureValue>, res: Response) => {
    try {
      const featureValue = new FeatureValue(req.body)
      await featureValue.save()
      res.status(201).send(featureValue)
    } catch (error) {
      res.status(400).send(error)
    }
  }
)

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const featureValue = await FeatureValue.findById(req.params.id)
    if (featureValue === null) return res.status(400).send()
    res.send(featureValue)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.patch(
  '/:id',
  auth([userRoles.Admin]),
  async (
    req: TypedRequestBodyWithParams<IFeatureValue, { id: string }>,
    res: Response
  ) => {
    try {
      const featureValue = await FeatureValue.findById(req.params.id)
      if (featureValue === null) return res.status(400).send()
      await updateByValidKeys(featureValue, req.body, ['value'])
      res.send(featureValue)
    } catch (error) {
      res.status(500).send(error)
    }
  }
)

export default router
