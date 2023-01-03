import { Schema, model, Model } from 'mongoose'
import Category, {
  discriminatorKey,
  ICategory,
  ICategoryMethods,
  categoryTypes,
} from './category'

export interface ILeafCategory extends ICategory {
  products: Schema.Types.ObjectId[]
  features: Schema.Types.ObjectId[]
  parent: Schema.Types.ObjectId
}
interface ILeafCategoryMethods extends ICategoryMethods {}
interface LeafCategoryModel
  extends Model<ILeafCategory, {}, ILeafCategoryMethods> {}

const LeafCategorySchema = new Schema<
  ILeafCategory,
  LeafCategoryModel,
  ILeafCategoryMethods
>(
  {
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  { discriminatorKey }
)

LeafCategorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
})

LeafCategorySchema.virtual('features', {
  ref: 'Feature',
  localField: '_id',
  foreignField: 'category',
})

LeafCategorySchema.pre('save', async function (next) {
  const parent = await Category.findById(this.parent)
  if (parent === null) throw new Error('parent category not found')
  if (parent.type === categoryTypes.Leaf)
    throw new Error('parent category is leaf')
  next()
})

const LeafCategory = Category.discriminator(
  categoryTypes.Leaf,
  LeafCategorySchema
)
export default LeafCategory
