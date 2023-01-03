import { Schema, model, Model } from 'mongoose'

export interface IFeatureValue {
  value: string
  feature: Schema.Types.ObjectId
  products: Schema.Types.ObjectId[]
}
interface IFeatureValueMethods {}
interface FeatureValueModel
  extends Model<IFeatureValue, {}, IFeatureValueMethods> {}
const FeatureValueSchema = new Schema<
  IFeatureValue,
  FeatureValueModel,
  IFeatureValueMethods
>(
  {
    value: {
      type: String,
      required: true,
      trim: true,
      maxlength: 511,
    },
    feature: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Feature',
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {}
)

const FeatureValue = model<IFeatureValue, FeatureValueModel>(
  'FeatureValue',
  FeatureValueSchema
)
export default FeatureValue
