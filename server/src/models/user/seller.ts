import { Schema, Model } from 'mongoose'

import User, { discriminatorKey, IUser, IUserMethods, userRoles } from './user'

export interface ISeller extends IUser {
  shopSlug?: string
  description?: string
  account: number
  ratings: {
    customer: Schema.Types.ObjectId
    value: number
  }[]
  rate: number
  address: {
    description: string
    coordinates?: {
      lat: number
      lon: number
    }
    zipCode: number
  }
}
interface ISellerMethods extends IUserMethods {}
interface SellerModel extends Model<ISeller, {}, ISellerMethods> {}

const SellerSchema = new Schema<ISeller, SellerModel, ISellerMethods>(
  {
    shopSlug: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
      maxlength: 1023,
      trim: true,
    },
    account: {
      type: Number,
      required: true,
      maxlength: 16,
      minlength: 16,
      set: function (value: number) {
        return Math.trunc(value)
      },
    },
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
    address: {
      type: {
        description: {
          type: String,
          required: true,
          maxLength: 511,
        },
        coordinates: {
          type: {
            lat: {
              type: Number,
              required: true,
            },
            lon: {
              type: Number,
              required: true,
            },
          },
          required: false,
        },
        zipCode: {
          type: Number,
          minlength: 10,
          maxlength: 10,
          set: function (value: number) {
            return Math.trunc(value)
          },
        },
      },
      required: true,
    },
  },
  { discriminatorKey }
)

SellerSchema.virtual('rate').get(function (this) {
  let total = 0
  this.ratings.forEach(rating => {
    total += rating.value
  })
  return total / this.ratings.length
})

SellerSchema.pre('save', function (next) {
  if (this.isNew) this.ratings = []
  next()
})

const Seller = User.discriminator(userRoles.Seller, SellerSchema)

export default Seller
