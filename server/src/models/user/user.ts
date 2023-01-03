import { Schema, model, Model, HydratedDocument } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const discriminatorKey = 'role'

export enum userRoles {
  Admin = 'Admin',
  Customer = 'Customer',
  Seller = 'Seller',
}

interface IUser {
  role: userRoles
  name: string
  lastName?: string
  email: string
  phoneNumber?: number
  password: string
  tokens: { token: string }[]
}
interface IUserMethods {
  generateAccessToken(): Promise<string>
}
interface UserModel extends Model<IUser, {}, IUserMethods> {
  findByCredentials(
    email: string,
    password: string
  ): Promise<HydratedDocument<IUser, IUserMethods>>
}

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    lastName: { type: String, required: false, maxlength: 255 },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) throw new Error('Invalid Email!!')
      },
    },
    phoneNumber: { type: Number, required: false, maxlength: 15 },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      maxlength: 255,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    discriminatorKey,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.tokens
        delete ret.password
      },
    },
  }
)

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8)
  }
  next()
})

UserSchema.method(
  'generateAccessToken',
  async function generateAccessToken(): Promise<string> {
    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.JWT_SECRET,
      {
        expiresIn: '1800s',
      }
    )
    this.tokens = this.tokens.concat({ token })
    await this.save()
    return token
  }
)

UserSchema.static(
  'findByCredentials',
  async function findByCredentials(
    email,
    password
  ): Promise<HydratedDocument<IUser, IUserMethods>> {
    const user = await this.findOne({ email })
    if (!user) throw new Error('no user found with the provided email')
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error('wrong password')
    return user
  }
)

const User = model<IUser, UserModel>('User', UserSchema)
export { IUser, IUserMethods, discriminatorKey }
export default User
