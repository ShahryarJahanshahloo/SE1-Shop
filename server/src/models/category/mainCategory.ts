import { Schema, model, Model } from 'mongoose'
import Category, {
  discriminatorKey,
  ICategory,
  ICategoryMethods,
  categoryTypes,
} from './category'

export interface IMainCategory extends ICategory {
  children: Schema.Types.ObjectId[]
}
interface IMainCategoryMethods extends ICategoryMethods {}
interface MainCategoryModel
  extends Model<IMainCategory, {}, IMainCategoryMethods> {}

const MainCategorySchema = new Schema<
  IMainCategory,
  MainCategoryModel,
  IMainCategoryMethods
>({}, { discriminatorKey })

MainCategorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
})

const MainCategory = Category.discriminator(
  categoryTypes.Main,
  MainCategorySchema
)
export default MainCategory
