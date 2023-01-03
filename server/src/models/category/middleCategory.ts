import { Schema, model, Model } from 'mongoose'
import Category, {
  discriminatorKey,
  ICategory,
  ICategoryMethods,
  categoryTypes,
} from './category'

export interface IMiddleCategory extends ICategory {
  children: Schema.Types.ObjectId[]
  parent: Schema.Types.ObjectId
}
interface IMiddleCategoryMethods extends ICategoryMethods {}
interface MiddleCategoryModel
  extends Model<IMiddleCategory, {}, IMiddleCategoryMethods> {}

const MiddleCategorySchema = new Schema<
  IMiddleCategory,
  MiddleCategoryModel,
  IMiddleCategoryMethods
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

MiddleCategorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
})

MiddleCategorySchema.pre('save', async function (next) {
  const parent = await Category.findById(this.parent)
  if (parent === null) throw new Error('parent category not found')
  if (parent.type === categoryTypes.Leaf)
    throw new Error('parent category is leaf')
  next()
})

const MiddleCategory = Category.discriminator(
  categoryTypes.Middle,
  MiddleCategorySchema
)
export default MiddleCategory
