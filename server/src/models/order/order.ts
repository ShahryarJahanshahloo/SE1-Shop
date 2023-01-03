import { Schema, model, Model } from 'mongoose'
import Customer from '../user/customer'
import Seller from '../user/seller'

export enum orderStates {
  Pending = 'Pending',
  Canceled = 'Canceled',
  Paid = 'Paid',
  Shipped = 'Shipped',
}

export interface IOrder {
  items: {
    product: Schema.Types.ObjectId
    seller: Schema.Types.ObjectId
    price: number
    quantity: number
  }[]
  customer: Schema.Types.ObjectId
  state: orderStates
  address: {
    description: string
    coordinates?: {
      lat: number
      lon: number
    }
    zipCode: number
  }
}
interface IOrderMethods {}
interface OrderModel extends Model<IOrder, {}, IOrderMethods> {}

const OrderSchema = new Schema<IOrder, OrderModel, IOrderMethods>(
  {
    items: {
      type: [
        {
          product: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Product',
          },
          seller: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User' /*needs seller-only filter*/,
          },
          price: {
            type: Number,
            required: true,
            set: function (value: number) {
              return Math.trunc(value)
            },
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
    },
    customer: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    state: {
      type: String,
      enum: orderStates,
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
  { timestamps: true }
)

OrderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const customer = await Customer.findById(this.customer)
    if (customer === null) throw new Error('customer not found')

    const sellers = new Set()
    this.items.forEach(item => {
      sellers.add(item.seller)
    })
    sellers.forEach(async sellerId => {
      const seller = await Seller.findById(sellerId)
      if (seller === null) throw new Error('invalid seller')
    })
  }

  next()
})

const Order = model<IOrder, OrderModel>('Order', OrderSchema)
export default Order
