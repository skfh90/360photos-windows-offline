import Realm, { BSON } from "realm";
export class History extends Realm.Object {
  _id: BSON.ObjectId = new BSON.ObjectID();
  user_id!: number;
  path?: string;
  type?: number;
  name?: string;
  status?: number;
  item_order?: number;
  no?: number;
  filepath?: string;
  fov?: string;
  is_completed: boolean = false;
  is_uploaded: boolean = false;
  is_downloaded: boolean = false;
  timestamp: Date = new Date();
  static primaryKey = "_id";
}
