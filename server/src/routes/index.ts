import express, { Router } from 'express'

import userRouter from './user/user'
import customerRouter from './user/customer'
import adminRouter from './user/admin'
import sellerRouter from './user/seller'
import categoryRouter from './category/category'
import featureRouter from './feature/feature'
import featureValueRouter from './feature/featureValue'
import productRouter from './product/product'
import storageItemRouter from './storageItem/storageItem'

const router: Router = express.Router()

router.get('/ping', (req, res) => {
  res.send('pong')
})

router.use('/user', userRouter)
router.use('/customer', customerRouter)
router.use('/admin', adminRouter)
router.use('/seller', sellerRouter)
router.use('/category', categoryRouter)
router.use('/feature', featureRouter)
router.use('/featureValue', featureValueRouter)
router.use('/product', productRouter)
router.use('/storageItem', storageItemRouter)

export default router
