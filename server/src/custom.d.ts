import { IUser } from './models/user/user'
import { HydratedDocument } from 'mongoose'

declare global {
  namespace Express {
    export interface Request {
      user: HydratedDocument<IUser>
      token?: string
    }
  }
}

export {}
