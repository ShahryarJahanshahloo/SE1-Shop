import { Schema, model, Model } from 'mongoose'
import Category, { categoryTypes } from '../category/category'

export interface IProduct {
  name: string
  description?: string
  category: Schema.Types.ObjectId
  isApproved: boolean
  isActive: boolean
  views: number
  featureValues: Schema.Types.ObjectId[]
}
interface IProductMethods {}
interface ProductModel extends Model<IProduct, {}, IProductMethods> {}

const ProductSchema = new Schema<IProduct, ProductModel, IProductMethods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: 511,
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    isApproved: {
      type: Boolean,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    views: {
      type: Number,
      required: true,
    },
    featureValues: [
      {
        type: Schema.Types.ObjectId,
        ref: 'FeatureValue',
      },
    ],
  },
  {
    timestamps: true,
  }
)

ProductSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.views = 0
    this.isActive = false
    this.isApproved = false
  }

  const category = await Category.findById(this.category)
  if (category === null) throw new Error('category not found')
  if (category.type !== categoryTypes.Leaf)
    throw new Error('category is not leaf')
  next()
})

const Product = model<IProduct, ProductModel>('Product', ProductSchema)
export default Product
