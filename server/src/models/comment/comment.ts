import { Schema, model, Model } from 'mongoose'
import Customer from '../user/customer'

interface IComment {
  product: Schema.Types.ObjectId
  customer: Schema.Types.ObjectId
  text: string
  upVotes: number
  downVotes: number
}
interface ICommentMethods {}
interface CommentModel extends Model<IComment, {}, ICommentMethods> {}

const CommentSchema = new Schema<IComment, CommentModel, ICommentMethods>(
  {
    product: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    customer: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    text: {
      type: String,
      required: true,
      maxlength: 511,
      minlength: 3,
    },
    upVotes: {
      type: Number,
      required: true,
      set: function (value: number) {
        return Math.trunc(value)
      },
    },
    downVotes: {
      type: Number,
      required: true,
      set: function (value: number) {
        return Math.trunc(value)
      },
    },
  },
  {}
)

CommentSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.upVotes = 0
    this.downVotes = 0
  }

  const customer = await Customer.findById(this.customer)
  if (customer === null) throw new Error('invalid customer')
  next()
})

const Comment = model<IComment, CommentModel>('Comment', CommentSchema)
export default Comment
