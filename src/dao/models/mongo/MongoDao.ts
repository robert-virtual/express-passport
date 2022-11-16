import {
  Collection,
  Db,
  DeleteResult,
  Filter,
  InsertOneResult,
  ObjectId,
  OptionalUnlessRequiredId,
  UpdateFilter,
  UpdateResult,
  WithId,
} from "mongodb";
import { IBaseDao } from "../IBaseDao";

export abstract class MongoDao<T> implements IBaseDao<T> {
  collectionName: string;
  db: Db;
  collection: Collection<T>;
  constructor(collectionName: string, db: Db) {
    this.collectionName = collectionName;
    this.db = db;
    this.collection = db.collection<T>(collectionName);
  }
  findOneById(id: string): Promise<T | WithId<T>> {
    return this.collection.findOne({_id:new ObjectId(id)} as WithId<Filter<T>>);
  }
  createOne(data: OptionalUnlessRequiredId<T>): Promise<InsertOneResult> {
    return this.collection.insertOne(data);
  }
  findMany(filter?: Filter<T> | null): Promise<WithId<T>[]> {
    return this.collection.find(filter ?? {}).toArray();
  }
  findOne(filter: WithId<Filter<T>> | Filter<T>): Promise<WithId<T>> {
    return this.collection.findOne(filter ?? {});
  }
  updateOne(
    filter: Filter<T>,
    data: Partial<T> | UpdateFilter<T>
  ): Promise<UpdateResult> {
    return this.collection.updateOne(filter, data);
  }
  deleteOne(filter: Filter<T>): Promise<DeleteResult> {
    return this.collection.deleteOne(filter);
  }
}
