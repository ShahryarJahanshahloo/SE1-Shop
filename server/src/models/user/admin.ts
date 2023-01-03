import { Schema, Model } from 'mongoose'

import User, { discriminatorKey, IUser, IUserMethods, userRoles } from './user'

export interface IAdmin extends IUser {}
interface IAdminMethods extends IUserMethods {}
interface AdminModel extends Model<IAdmin, {}, IAdminMethods> {}

const AdminSchema = new Schema<IAdmin, AdminModel, IAdminMethods>(
  {},
  { discriminatorKey }
)

const Admin = User.discriminator(userRoles.Admin, AdminSchema)

export default Admin
