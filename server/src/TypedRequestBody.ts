import { Express } from 'express'

export interface TypedRequestBody<T> extends Express.Request {
  body: T
}

export interface TypedRequestBodyWithParams<BodyType, ParamsType>
  extends Express.Request {
  body: BodyType
  params: ParamsType
}
