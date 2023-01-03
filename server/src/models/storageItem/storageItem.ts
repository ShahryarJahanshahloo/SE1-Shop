import { Schema, model, Model } from 'mongoose'
import Seller from '../user/seller'

export interface IStorageItem {
  product: Schema.Types.ObjectId
  seller: Schema.Types.ObjectId
  quantity: number
  price: number
  sold: number
}
interface IStorageItemMethods {}
interface StorageItemModel
  extends Model<IStorageItem, {}, IStorageItemMethods> {}

const StorageItemSchema = new Schema<
  IStorageItem,
  StorageItemModel,
  IStorageItemMethods
>(
  {
    product: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    seller: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      set: function (value: number) {
        return Math.trunc(value)
      },
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      set: function (value: number) {
        return Math.trunc(value)
      },
    },
    sold: {
      type: Number,
      required: true,
    },
  },
  {}
)

StorageItemSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.sold = 0
  }

  const seller = await Seller.findById(this.seller)
  if (seller === null) throw new Error('seller not found')
  next()
})

const StorageItem = model<IStorageItem, StorageItemModel>(
  'StorageItem',
  StorageItemSchema
)
export default StorageItem
