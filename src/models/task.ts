import Realm, { BSON } from "realm";
export class Task extends Realm.Object {
  _id: BSON.ObjectId = new BSON.ObjectID();
  description!: string;
  isComplete: boolean = false;
  createdAt: Date = new Date();
  userId!: string;

  static primaryKey = "_id";
}
