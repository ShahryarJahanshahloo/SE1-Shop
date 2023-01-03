import { Schema, model, Model } from 'mongoose'
import LeafCategory from '../category/leafCategory'

export interface IFeature {
  label: string
  category: Schema.Types.ObjectId
  values: Schema.Types.ObjectId[]
}
interface IFeatureMethods {}
interface FeatureModel extends Model<IFeature, {}, IFeatureMethods> {}
const FeatureSchema = new Schema<IFeature, FeatureModel, IFeatureMethods>(
  {
    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
  },
  {}
)

FeatureSchema.virtual('values', {
  ref: 'FeatureValue',
  localField: '_id',
  foreignField: 'feature',
})

FeatureSchema.pre('save', async function (next) {
  const category = await LeafCategory.findById(this.category)
  if (category === null) throw new Error('category not found')
  next()
})

const Feature = model<IFeature, FeatureModel>('Feature', FeatureSchema)
export default Feature
