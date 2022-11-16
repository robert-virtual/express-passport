import { Db, MongoClient } from "mongodb";

let db: Db;

export function getMongoDB() {
  if (db) {
    console.log("connected to existing mongodb");
    return db;
  }
  if (!process.env.MONGO_URI) {
    throw new Error("INVALID MONGO_URI");
  }
  db = new MongoClient(process.env.MONGO_URI).db();
  console.log("connected to mongodb");

  return db;
}
