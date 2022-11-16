import { hash } from "argon2";
import { getMongoDB } from "../../../config/mongoConnection";
import { IUser, UserStatus } from "../entities/IUser";
import { MongoDao } from "./MongoDao";

export class UsersMongoDao extends MongoDao<IUser> {
  constructor() {
    super("users",getMongoDB());
  }
  async signup({password,email}:{email:string,password:string}){
    password = await hash(password);
    return super.createOne({email,password,status:UserStatus.ACT,name:"",lastLogin:new Date(),failedLogins:0});
  }
}
