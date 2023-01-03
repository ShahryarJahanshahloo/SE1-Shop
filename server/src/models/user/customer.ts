import { Schema, Model } from 'mongoose'

import User, { discriminatorKey, IUser, IUserMethods, userRoles } from './user'

export interface ICustomer extends IUser {
  balance: number
  address?: {
    description: string
    coordinates?: {
      lat: number
      lon: number
    }
    zipCode: number
  }
  cart: {
    storageItem: Schema.Types.ObjectId
    quantity: number
  }[]
}
interface ICustomerMethods extends IUserMethods {}
interface CustomerModel extends Model<ICustomer, {}, ICustomerMethods> {}

const CustomerSchema = new Schema<ICustomer, CustomerModel, ICustomerMethods>(
  {
    balance: {
      type: Number,
      required: true,
      set: function (value: number) {
        return Math.trunc(value)
      },
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
      required: false,
    },
    cart: {
      type: [
        {
          storageItem: {
            type: Schema.Types.ObjectId,
            ref: 'StorageItem',
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            set: function (value: number) {
              return Math.trunc(value)
            },
          },
        },
      ],
      maxlength: 20,
    },
  },
  { discriminatorKey }
)

CustomerSchema.pre('save', function (next) {
  if (this.isNew) this.balance = 0
  next()
})

const Customer = User.discriminator(userRoles.Customer, CustomerSchema)

export default Customer
