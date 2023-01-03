import { Schema, model, Model } from 'mongoose'

const discriminatorKey = 'type'

export enum categoryTypes {
  Main = 'Main',
  Middle = 'Middle',
  Leaf = 'Leaf',
}

interface ICategory {
  type: categoryTypes
  name: string
  isActive: boolean
}
interface ICategoryMethods {}
interface CategoryModel extends Model<ICategory, {}, ICategoryMethods> {}

const CategorySchema = new Schema<ICategory, CategoryModel, ICategoryMethods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  { discriminatorKey }
)

CategorySchema.pre('save', function (next) {
  if (this.isNew) this.isActive = false
  next()
})

const Category = model<ICategory, CategoryModel>('Category', CategorySchema)
export { ICategory, ICategoryMethods, discriminatorKey }
export default Category
