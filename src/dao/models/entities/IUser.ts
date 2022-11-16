
export enum UserStatus{
  ACT,
  INA,
  BLQ
}
export interface IUser{
  name:string
  email:string
  password:string
  status:UserStatus
  lastLogin:Date
  failedLogins:number
  _id?:string
}
