import {
  Collection,
  Db,
  DeleteResult,
  Filter,
  InsertOneResult,
  OptionalUnlessRequiredId,
  UpdateFilter,
  UpdateResult,
  WithId,
} from "mongodb";

export interface IBaseDao<T> {
  collectionName: string;
  db: Db;
  collection?: Collection<T>;
  createOne(
    data: T | OptionalUnlessRequiredId<T>
  ): Promise<T | InsertOneResult>;
  findMany(filter?: Partial<T> | Filter<T>): Promise<T[] | WithId<T>[]>;
  findOne(filter: Partial<T> | Filter<T>): Promise<T | WithId<T>>;
  findOneById(id:string): Promise<T | WithId<T>>;
  updateOne(
    filter: Partial<T> | Filter<T>,
    data: Partial<T> | UpdateFilter<T>
  ): Promise<UpdateResult>;
  deleteOne(filter: Partial<T> | Filter<T>): Promise<DeleteResult>;
}
