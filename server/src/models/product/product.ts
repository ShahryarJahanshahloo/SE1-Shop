import { Schema, model, Model } from 'mongoose'
import LeafCategory from '../category/leafCategory'

export interface IProduct {
  name: string
  description?: string
  category: Schema.Types.ObjectId
  isApproved: boolean
  isActive: boolean
  views: number
  featureValues: Schema.Types.ObjectId[]
  ratings: {
    customer: Schema.Types.ObjectId
    value: number
  }[]
  sold: number
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
      set: function (value: number) {
        return Math.trunc(value)
      },
    },
    featureValues: [
      {
        type: Schema.Types.ObjectId,
        ref: 'FeatureValue',
      },
    ],
    ratings: {
      type: [
        {
          customer: {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
          },
          value: {
            type: Number,
            min: 0,
            max: 5,
            set: function (value: number) {
              return Math.trunc(value)
            },
          },
        },
      ],
      required: true,
    },
    sold: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

ProductSchema.virtual('rate').get(function (this) {
  let total = 0
  this.ratings.forEach(rating => {
    total += rating.value
  })
  return total / this.ratings.length
})

ProductSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.views = 0
    this.isActive = false
    this.isApproved = false
    this.ratings = []
    this.sold = 0
  }

  const category = await LeafCategory.findById(this.category)
  if (category === null) throw new Error('category not found')
  next()
})

const Product = model<IProduct, ProductModel>('Product', ProductSchema)
export default Product
